import React,{useState, useEffect} from 'react'

import {Card, Loader, Form} from '../composants'

const RenderCards = ({data, title}) => {
    if(data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post}/>)
    }
    return (
        <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>
    )
}

const Home = () => {
    const [loading, setloading] = useState(false);
    const [allPosts, setallPosts] = useState(null);
    const [searchText, setsearchText] = useState('');

    const [searchResults, setsearchResults] = useState(null);
    const [searchTimeout, setsearchTimeout] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            setloading(true);
            try {
                const response = await fetch('http://localhost:8080/api/v1/post',{
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                })
                if(response.ok){
                    const result = await response.json();

                    setallPosts(result.data.reverse());
                }
            } catch (error) {
                alert(error);
            }finally{
                setloading(false);
            }
        }
        fetchPosts();
    },[]); // le tab de depandences est vide psq on appelle la fonc au deb
    const handleSearchChange = (event) =>{
        clearTimeout(searchTimeout);
        setsearchText(event.target.value);

        setsearchTimeout(
            setTimeout(() => {
                const result_search = allPosts.filter((item) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
                    setsearchResults(result_search);
            }, 500)
        );
        
    }
  return (
    <section className='max-w-7xl mx-auto'>
        <div>
            <h1 className='font-extrabold text-[#22328] text-[32px]'> La communauté des images générées</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'> parcourir une collection d’images imaginatives et visuellement superbes générées par DALL E IA</p>
        </div>

        <div className='mt-16'>
            <Form 
             labelName="Recherche d'un post"
             type="text"
             placeholder="Recherche"
             value={searchText}
             handleChange={handleSearchChange}
            />

        </div>
        <div className='mt-10'>
            {loading ? (
                <div className='flex justify-center items-center'>
                    <Loader/>
                </div>
            ) : (
                <>
                {searchText &&(
                    <h2 className='font-medium text-[#666e75] text-xl mb-3'> Résultats pour <span className='text-[#222328]'>{searchText}</span></h2>
                )}
                <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                    {searchText ?(
                        <RenderCards 
                        data={searchResults}
                        title="Aucun résultat de recherche trouvé"
                        />
                    ) : (
                        <RenderCards
                         data={allPosts}
                         title="Aucun poste trouvé"
                        />
                    )}
                </div>
                </>
            )}

        </div>
    </section>
  )
}

export default Home
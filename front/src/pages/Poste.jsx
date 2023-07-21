import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets';
import {getRandomPrompt} from '../utils';
import { Form, Loader } from '../composants';

const Poste = () => {
  // to navigate to the home page once the post created 
  const navigate = useNavigate();

  const [form, setform] = useState(
   { name:'',
    prompt:'',
    photo:'',
  });
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setloading] = useState(false);
  
  const handleSubmit =async (event) => {
    event.preventDefault(); //to not realod auto the app

    if(form.prompt && form.photo){
      setloading(true);//show loading icon while generating img
      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method:'POST',
          headers:{'Content-Type':'application/json',},
          body:JSON.stringify(form)
        })

        await response.json(); //we got the response
        navigate('/');
      } catch (error) {
        alert(error);
      }finally{
        setloading(false);
      }
    }else{
      alert('Veuillez générer une image :) ');
    }
  }
  const handleChange = (event) =>{
    setform({ ...form,[event.target.name]: event.target.value})
  }
  const handleSurpriseMe = () =>{
    const randomPrompt= getRandomPrompt(form.prompt);
    setform({ ...form, prompt:randomPrompt})
  }
  
  const generateImage= async() => {
    if(form.prompt){
      try {
        setgeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({prompt :form.prompt}),
        })
        const data =await response.json();
        setform({...form,photo:`data:image/jpeg;base64,${data.photo}`}) //to save and render the image 
      } catch (error) {
        alert(error);
      }
      finally{
        setgeneratingImg(false);
      }
    }else{
      alert('Please enter a prompt')
    }
  }
  return (
    <section className='max-w-7xl mx-auto'>
      <div>
            <h1 className='font-extrabold text-[#22328] text-[32px]'> Créer</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'> Créer des images imaginatives et visuellement époustouflantes grâce à DALL-E IA et les partager avec la communauté</p>
        </div>

        <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-5'>
            <Form 
              labelName="Votre Nom"
              type="text"
              name="name"
              placeholder="John"
              value={form.name}
              handleChange={handleChange}
            />
            <Form 
              labelName="Entré"
              type="text"
              name="prompt"
              placeholder="une loutre de mer avec une boucle d’oreille perlée"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />
            <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 flex justify-center items-center'>
              {form.photo ?(
                <img src={form.photo} alt={form.prompt}
                  className='w-full h-full object-contain'/>
              ) : (
                <img src={preview} alt="preview"
                  className='w-9/12 h-9/12 object-contain opacity-40' />
              )}

              {generatingImg &&(
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader />
                </div>
              )}
            </div>
          </div>

          <div className='mt-5 flex gap-5'>
            <button type='button'
              onClick={generateImage}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5' >
                {generatingImg ? 'Génération ...' : 'Générer'}
            </button>
          </div>

          <div className='mt-10'>
            <p className='mt-2 text-[#666e75] text-[14px]'>Une fois que vous avez créé l’image que vous voulez,
             vous pouvez la partager avec d’autres dans la communauté </p>
              <button type="submit"
                className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                {loading ? 'Partage ...' :'Partager avec la communauté'}
              </button>
          </div>
        </form>

    </section>
  )
}

export default Poste
const api = import.meta.env.VITE_BACKEND_URL;


export const Airesponse = async (prompt, imagefile=null)=>{
    const formdata = new FormData()

    formdata.append('prompt', prompt)
    if (imagefile) formdata.append('image', imagefile);

    const response = await fetch(`${api}/api/ask-openai`,{
        method: 'POST',
        body: formdata
    })
    const data = await response.json()
    return data.reply || "Sorry, I couldn't get a response.";
}
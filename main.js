document.addEventListener('DOMContentLoaded', () => {
  const srch = document.querySelector('.fa-search')
  const search = document.querySelector('#search')
  const section = document.querySelector('section')
  const loader = document.querySelector('.loader')

  const api_key = 'sorry, forgot to hide this'
  const Final_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=50&offset=0&rating=g&bundle=messaging_non_clips`
  const copyLink = 'https://media4.giphy.com/media/${gif.id}/giphy.mp4'
  let imageData // Declare imageData variable outside fetch call

  let generateGif = async url => {
    try {
      {
        let req = await fetch(url)
        let res = await req.json()

        if (res.data && res.data.length > 0) {
          data(res.data)
        } else {
          loader.style.display = 'none'
          section.innerHTML = '<p>No GIFs found</p>'
        }
      }
    } catch (error) {
      console.error('Error fetching GIFs:', error)
      section.innerHTML = '<p>Error fetching GIFs</p>'
      loader.style.display = 'none'
    }
  }

  srch.addEventListener('click', () => {
    search.style.display = 'block'
  })
  function data (gifs) {
    section.innerHTML = ''
    gifs.forEach(gif => {
      const gifElement = document.createElement('div')
      const gifImg = document.createElement('img')
      const title = document.createElement('p')
      const btn = document.createElement('button')
      const dBtn = document.createElement('a')
      btn.classList.add('btn')
      title.classList.add('title')
      gifElement.classList.add('giff')

      btn.innerHTML = 'Download'
      gifImg.src = gif.images.fixed_height.url
      gifImg.setAttribute('preload', 'auto')
      gifImg.alt = gif.title
      title.innerHTML = gif.title
      gifImg.onload = () => { gifImg.addEventListener('error', () => {
        console.error('Failed to load image:', gifImg.src)
        gifImg.src = gif.images.fixed_height.url
      })
        loader.style.display = 'none'
      }
     
      ///////////////////////download///////////////
      fetch(gif.images.fixed_height.url)
        .then(response => response.blob())
        .then(data => {
          const urlCreator = window.URL || window.webkitURL
          imageData = urlCreator.createObjectURL(data)
          gifImg.src = imageData

          // Set href and download attributes for download button
          dBtn.setAttribute('href', imageData)
          dBtn.setAttribute('download', `${gif.title}.gif`)
        })
        .catch(error => {
          console.error('Failed to fetch image data:', error)
        })

      // Set href and download attributes for download button
      dBtn.setAttribute('href', imageData)
      dBtn.setAttribute('download', `${gif.title}.gif`)
      ///////////////////////download///////////////

      btn.setAttribute('download', gif.title)
      btn.setAttribute('href', imageData)
      loader.style.display = 'none'

      gifElement.appendChild(gifImg)
      gifElement.append(title)
      dBtn.append(btn)
      gifElement.appendChild(dBtn)
      section.appendChild(gifElement)
      lazyLoadGif(gifElement, gif)
    })
  }
  function lazyLoadGif (gifElement, gif) {
    gifElement.addEventListener('mouseenter', () => {
      console.log(gifElement.title)
      if (!gifElement.dataset.loaded) {
        // Check if GIF is not already loaded
        // Fetch image data
        fetch(gif.images.fixed_height.url)
          .then(response => response.blob())
          .then(data => {
            const urlCreator = window.URL || window.webkitURL
            const imageData = urlCreator.createObjectURL(data)
            gifElement.src = imageData
            gifElement.dataset.loaded = true // Mark GIF as loaded
          })
          .catch(error => {
            console.error('Failed to fetch image data:', error)
          })
      }
    })
  }
  srch.addEventListener('click', () => {
    search.style.display = 'block'
  })

  search.addEventListener('keyup', () => {
    loader.style.display = 'flex'
    const searchValue = search.value.trim()
    section.innerHTML = ''
    const searchAPI = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${searchValue}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    generateGif(searchAPI)
  })
  generateGif(Final_URL)
})

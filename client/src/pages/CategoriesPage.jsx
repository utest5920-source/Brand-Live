import { useEffect, useState } from 'react'
import { categoryApi, imageApi } from '../lib/api'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [selected, setSelected] = useState('')
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)

  const refresh = async () => {
    const { data } = await categoryApi.list()
    setCategories(data)
  }

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    (async () => {
      if (!selected) { setImages([]); return }
      const { data } = await imageApi.list(selected)
      setImages(data)
    })()
  }, [selected])

  const addCategory = async () => {
    if (!newName) return
    await categoryApi.create({ name: newName })
    setNewName('')
    await refresh()
  }

  const upload = async () => {
    if (!file || !selected) return
    const fd = new FormData()
    fd.append('categoryId', selected)
    if (title) fd.append('title', title)
    fd.append('image', file)
    await imageApi.upload(fd)
    const { data } = await imageApi.list(selected)
    setImages(data)
    setTitle(''); setFile(null)
  }

  return (
    <div className="page colorful">
      <h1>Image Categories</h1>
      <div className="card">
        <input placeholder="New category name" value={newName} onChange={e=>setNewName(e.target.value)} />
        <button onClick={addCategory}>Add Category</button>
      </div>

      <div className="card">
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Image title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button onClick={upload}>Upload Image</button>
      </div>

      <div className="card">
        <h3>Images</h3>
        <div className="grid">
          {images.map(img => (
            <div key={img.id} className="thumb">
              <img src={img.fileUrl} alt={img.title || 'image'} />
              <div>{img.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
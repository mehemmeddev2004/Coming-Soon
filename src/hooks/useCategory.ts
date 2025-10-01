import { useState } from "react"
import { fetchCategories, createCategory } from "@/utils/fetchCategories"
import { category } from "@/types/category"

export const useCategory = () => {
  const [categories, setCategories] = useState<category[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    img: "",
    parentId: ""
  })

  const loadCategories = async () => {
    try {
      console.log("🔄 Loading categories...")
      const categoriesData = await fetchCategories()
      console.log("✅ Categories loaded from API:", categoriesData)
      console.log("📊 Total categories count:", categoriesData?.length || 0)
      
      if (categoriesData && Array.isArray(categoriesData)) {
        console.log("🎯 Setting categories to state...")
        setCategories(categoriesData)
        console.log("✅ Categories set to state successfully")
      } else {
        console.warn("⚠️ Invalid categories data:", categoriesData)
        setCategories([])
      }
    } catch (error) {
      console.error("❌ Kateqoriyalar yüklənmədi:", error)
      setCategories([])
    }
  }

  const handleAddCategory = async (): Promise<{ success: boolean; message: string }> => {
    if (!newCategory.name.trim()) {
      return { success: false, message: "Kateqoriya adı məcburidir!" }
    }

    // Check if category already exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategory.name.trim().toLowerCase() ||
      cat.slug === (newCategory.slug.trim() || newCategory.name.toLowerCase().replace(/\s+/g, "-"))
    )

    if (existingCategory) {
      return { success: false, message: `"${newCategory.name}" kateqoriyası artıq mövcuddur!` }
    }
    
    try {
      const categoryData = {
        name: newCategory.name.trim(),
        slug: newCategory.slug.trim() || newCategory.name.toLowerCase().replace(/\s+/g, "-"),
        imageUrl: newCategory.img || "https://res.cloudinary.com/.../image.jpg",
        parentId: newCategory.parentId || null
      }
      
      const result = await createCategory(categoryData)
      
      if (result) {
        console.log("Category created successfully:", result)
        
        // Option 1: Refresh categories list
        await loadCategories()
        
        // Option 2: Manual add to state (backup method)
        if (result.id) {
          const newCategoryItem = {
            id: result.id,
            name: result.name || categoryData.name,
            slug: result.slug || categoryData.slug,
            imageUrl: result.imageUrl || categoryData.imageUrl,
            parentId: result.parentId || categoryData.parentId,
            createdAt: result.createdAt || new Date().toISOString(),
            updatedAt: result.updatedAt || new Date().toISOString(),
            children: [],
            parent: null
          }
          
          // Add to existing categories if not already there
          const exists = categories.find(cat => cat.id === newCategoryItem.id)
          if (!exists) {
            console.log("Adding category manually to state:", newCategoryItem)
            setCategories(prev => [...prev, newCategoryItem])
          }
        }
        
        setNewCategory({ name: "", slug: "", img: "", parentId: "" })
        setShowCategoryForm(false)
        return { success: true, message: "Kateqoriya uğurla əlavə edildi!" }
      } else {
        console.log("Category creation failed")
        return { success: false, message: "Kateqoriya əlavə edilmədi" }
      }
    } catch (error: any) {
      // Handle specific error messages
      if (error.message?.includes("already exists")) {
        return { success: false, message: "Bu kateqoriya artıq mövcuddur!" }
      }
      return { success: false, message: `Xəta: ${error.message || "Bilinməyən xəta"}` }
    }
  }

  return {
    categories,
    setCategories,
    showCategoryForm,
    setShowCategoryForm,
    newCategory,
    setNewCategory,
    loadCategories,
    handleAddCategory
  }
}

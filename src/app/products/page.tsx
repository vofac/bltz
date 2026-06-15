'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ChevronRight, Layers, Shield, Leaf, Sparkles } from 'lucide-react'

const categories = ['全部', '艺术漆', '质感涂料', '功能涂料', '特种涂料']

const products = [
  {
    id: 1,
    name: '仿石漆',
    category: '艺术漆',
    effect: '石材质感效果',
    features: ['逼真石材纹理', '耐候性强', '色彩持久'],
    desc: '采用天然彩砂及多种特殊骨料配制而成，能模拟出各种天然大理石、花岗岩等名贵石材的质感和纹理，广泛应用于建筑外立面装饰。',
    gradient: 'from-[#0A3D5C] to-[#1E6B8C]',
    badge: '热销',
  },
  {
    id: 2,
    name: '艺术肌理漆',
    category: '艺术漆',
    effect: '丰富肌理纹理',
    features: ['多种纹理效果', '手感细腻', '个性化定制'],
    desc: '通过特殊施工工艺，在墙面形成独特的肌理纹理效果，可实现砂岩、拉丝、水波等多种视觉效果，满足高端室内装饰需求。',
    gradient: 'from-[#1E6B8C] to-[#2980A8]',
    badge: '新品',
  },
  {
    id: 3,
    name: '金属质感漆',
    category: '艺术漆',
    effect: '金属光泽效果',
    features: ['金属光泽感', '高贵典雅', '耐磨性好'],
    desc: '融合金属粒子与特种树脂，呈现出高贵典雅的金属光泽感。产品耐磨、耐久，适用于酒店、会所、高档住宅等高端场所装饰。',
    gradient: 'from-[#E8A020] to-[#C47F10]',
    badge: '推荐',
  },
  {
    id: 4,
    name: '藻泥涂料',
    category: '质感涂料',
    effect: '生态环保',
    features: ['天然环保', '调节湿度', '净化空气'],
    desc: '以天然海藻泥为主要原料，不添加任何有机溶剂，具有良好的调节室内湿度、净化空气、防霉抑菌等功效，是健康居家的理想选择。',
    gradient: 'from-[#2D7A4F] to-[#1E5C3A]',
    badge: '环保',
  },
  {
    id: 5,
    name: '硅藻泥',
    category: '质感涂料',
    effect: '吸湿调湿',
    features: ['强力吸湿', '防霉抑菌', '隔热保温'],
    desc: '以硅藻土为核心原料，具有超强的吸湿调湿功能，能有效吸附室内甲醛、苯等有害物质，兼具防霉抑菌、隔热保温等多重功效。',
    gradient: 'from-[#3D8A6E] to-[#2D6A50]',
    badge: '热销',
  },
  {
    id: 6,
    name: '弹性防水涂料',
    category: '功能涂料',
    effect: '防水防裂',
    features: ['高弹性防水', '抗裂性强', '耐久性好'],
    desc: '采用高弹性丙烯酸酯聚合物乳液为基料，具有优异的防水性能和弹性，能有效跨越基底裂缝，适用于屋面、外墙、卫浴间等防水工程。',
    gradient: 'from-[#0A3D5C] to-[#0D5279]',
    badge: '专业',
  },
  {
    id: 7,
    name: '竹炭负离子漆',
    category: '功能涂料',
    effect: '净化空气',
    features: ['负离子释放', '除甲醛', '抗菌防霉'],
    desc: '将竹炭粉末与负离子释放材料有机结合，能持续释放负离子，有效分解室内甲醛、苯等有害气体，具有抗菌防霉、净化空气的双重功效。',
    gradient: 'from-[#2C3E50] to-[#1A252F]',
    badge: '健康',
  },
  {
    id: 8,
    name: '彩砂涂料',
    category: '特种涂料',
    effect: '彩色砂粒效果',
    features: ['天然彩砂', '立体质感', '色彩丰富'],
    desc: '以天然彩色砂粒为主要骨料，搭配特种粘合剂制成，可呈现出丰富的色彩和立体的砂粒质感，广泛用于外墙装饰及室内特色墙面。',
    gradient: 'from-[#8B4513] to-[#6B3410]',
    badge: '特色',
  },
]

const effectsGallery = [
  { name: '石材效果', desc: '以假乱真的天然大理石纹理', gradient: 'from-[#808080] to-[#505050]' },
  { name: '金属效果', desc: '高贵典雅的金属光泽', gradient: 'from-[#E8A020] to-[#C47F10]' },
  { name: '肌理效果', desc: '独特的立体肌理纹路', gradient: 'from-[#0A3D5C] to-[#1E6B8C]' },
  { name: '自然效果', desc: '贴近自然的生态质感', gradient: 'from-[#2D7A4F] to-[#1E5C3A]' },
]

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = activeCategory === '全部'
    ? products
    : products.filter((p) => p.category === activeCategory)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">首页</Link>
            <ChevronRight size={14} />
            <span>产品中心</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">产品中心</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            佰利学院精选涂装产品，涵盖艺术漆、质感涂料、功能涂料及特种涂料四大系列，
            满足各类装饰场景需求，并配有专业施工工艺培训指导。
          </p>
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            {[
              { icon: <Sparkles size={16} />, text: '艺术漆系列' },
              { icon: <Leaf size={16} />, text: '质感涂料系列' },
              { icon: <Shield size={16} />, text: '功能涂料系列' },
              { icon: <Layers size={16} />, text: '特种涂料系列' },
            ].map((item) => (
              <div key={item.text} className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1.5">
                <span className="text-[#E8A020]">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#0A3D5C] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              共 <span className="font-semibold text-[#0A3D5C]">{filtered.length}</span> 款产品
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                {/* Image placeholder */}
                <div className={`h-44 bg-gradient-to-br ${product.gradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold opacity-30 mb-1">{product.name}</div>
                      <div className="text-xs opacity-50">{product.effect}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-[#E8A020]">
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-black/30">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#0A3D5C] mb-1">{product.name}</h3>
                  <p className="text-xs text-[#E8A020] font-medium mb-2">{product.effect}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{product.desc}</p>
                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-[#1E6B8C] flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/techniques"
                    className="block w-full text-center py-2 rounded-lg text-sm font-semibold text-white bg-[#0A3D5C] hover:bg-[#1E6B8C] transition-colors duration-200"
                  >
                    查看施工工艺
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Effects Gallery */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">效果展示</h2>
            <p className="text-gray-500 max-w-xl mx-auto">多种涂装效果，满足不同装饰风格需求</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {effectsGallery.map((item) => (
              <div key={item.name} className={`bg-gradient-to-br ${item.gradient} rounded-xl h-40 flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform duration-200`}>
                <div className="text-lg font-bold mb-1">{item.name}</div>
                <div className="text-xs opacity-70 text-center px-2">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#0A3D5C] to-[#1E6B8C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">想深入了解产品施工工艺？</h2>
          <p className="text-blue-100 mb-6">报名参加我们的专业培训课程，系统学习各类涂装产品的施工技法</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="px-8 py-3 rounded-lg font-bold text-[#0A3D5C] bg-[#E8A020] hover:opacity-90 transition-all duration-200"
            >
              查看课程
            </Link>
            <Link
              href="/techniques"
              className="px-8 py-3 rounded-lg font-bold text-white border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              施工工艺指南
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Wrench, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

const difficultyLevels = ['全部', '基础工艺', '进阶工艺', '专业工艺']

const techniques = [
  {
    id: 1,
    name: '墙面基底处理',
    difficulty: '基础工艺',
    duration: '2-4小时',
    desc: '所有涂装施工的基础，确保墙面干净、平整、干燥，为后续涂装工序打好基础。',
    steps: [
      { no: 1, title: '检查基底', detail: '仔细检查墙面是否有空鼓、裂缝、渗水等问题，标记需要修补的区域' },
      { no: 2, title: '清洁墙面', detail: '清除墙面浮灰、油污、旧涂层等杂质，用清水冲洗并晾干' },
      { no: 3, title: '修补裂缝', detail: '用腻子或专用填缝剂填补裂缝和孔洞，待干透后进行打磨' },
      { no: 4, title: '打磨平整', detail: '用砂纸或打磨机对修补区域进行打磨，使其与周边墙面平滑过渡' },
      { no: 5, title: '清理浮尘', detail: '打磨完成后彻底清理浮尘，用湿布擦拭确保表面干净' },
    ],
    tools: ['腻子刀', '砂纸', '搅拌机'],
    tips: '确保基底干燥，含水率应低于10%，否则会影响涂料附着力和最终效果。',
    gradient: 'from-[#0A3D5C] to-[#1E6B8C]',
  },
  {
    id: 2,
    name: '普通乳胶漆施工',
    difficulty: '基础工艺',
    duration: '4-6小时',
    desc: '最常见的室内涂装工艺，适用于各类居住和商业空间的墙面、顶棚装饰施工。',
    steps: [
      { no: 1, title: '调配乳胶漆', detail: '按产品说明书调配乳胶漆，加入适量清水搅拌均匀，注意水量不宜过多' },
      { no: 2, title: '底涂处理', detail: '涂刷一层底漆，增强乳胶漆的附着力，防止碱性物质渗透' },
      { no: 3, title: '第一遍涂刷', detail: '用滚筒均匀涂刷第一遍，注意力度均匀，避免流挂，待干4-6小时' },
      { no: 4, title: '第二遍涂刷', detail: '第一遍完全干燥后进行轻微打磨，然后涂刷第二遍确保均匀覆盖' },
    ],
    tools: ['滚筒刷', '毛刷', '托盘'],
    tips: '施工环境温度应在5℃以上，30℃以下，相对湿度低于85%，避免在雨天或潮湿环境施工。',
    gradient: 'from-[#1E6B8C] to-[#2980A8]',
  },
  {
    id: 3,
    name: '底漆施工工艺',
    difficulty: '基础工艺',
    duration: '2-3小时',
    desc: '底漆是涂装体系的基础层，能显著提升面漆的附着力、遮盖力和整体涂装效果。',
    steps: [
      { no: 1, title: '检查基底', detail: '确认基底已完成处理，干燥洁净，含水率符合要求' },
      { no: 2, title: '调配底漆', detail: '按比例稀释底漆，充分搅拌均匀，过滤杂质' },
      { no: 3, title: '均匀涂刷', detail: '用刷子或滚筒均匀涂刷底漆，注意不漏刷、不流挂' },
      { no: 4, title: '等待干燥', detail: '自然干燥4-8小时，或按产品说明等待规定时间后施工面漆' },
    ],
    tools: ['喷枪', '搅拌棒', '保护膜'],
    tips: '底漆与面漆应选用同品牌、同体系产品，避免因涂料体系不兼容导致开裂、脱落等问题。',
    gradient: 'from-[#0A3D5C] to-[#0D5279]',
  },
  {
    id: 4,
    name: '艺术肌理漆施工',
    difficulty: '进阶工艺',
    duration: '8-12小时',
    desc: '通过专业施工手法，在墙面创造出独特的肌理纹路效果，提升空间艺术感和格调。',
    steps: [
      { no: 1, title: '基底处理', detail: '彻底处理基底，确保平整干燥，必要时批刮腻子找平' },
      { no: 2, title: '调配涂料', detail: '按比例调配艺术肌理漆，加入适量色浆调色至目标色泽' },
      { no: 3, title: '第一层底涂', detail: '涂刷一遍艺术底漆，均匀覆盖后等待完全干燥' },
      { no: 4, title: '肌理效果层', detail: '用特殊滚筒或抹刀蘸取肌理漆，以特定手法在墙面创造肌理纹路' },
      { no: 5, title: '细节处理', detail: '用刮板或小刷对细节部位和边角进行精细处理，完善整体效果' },
      { no: 6, title: '保护面漆', detail: '完全干燥后涂刷透明保护清漆，增强耐久性和易清洁性' },
    ],
    tools: ['特殊滚筒', '抹刀', '刮板'],
    tips: '肌理效果层施工时要保持力度和手法的一致性，大面积施工建议分区操作，避免接头痕迹过于明显。',
    gradient: 'from-[#E8A020] to-[#C47F10]',
  },
  {
    id: 5,
    name: '仿石漆喷涂工艺',
    difficulty: '进阶工艺',
    duration: '10-14小时',
    desc: '通过专业喷枪喷涂工艺，模拟天然石材的外观和质感，适用于建筑外立面高端装饰。',
    steps: [
      { no: 1, title: '基底处理', detail: '对基底进行彻底清洁和修补，必要时涂刷专用封底漆' },
      { no: 2, title: '调配石漆', detail: '按照设计要求选配彩砂和底料的比例，充分搅拌均匀' },
      { no: 3, title: '喷涂底层', detail: '用专业喷枪喷涂第一遍底漆，形成良好的基础层' },
      { no: 4, title: '仿石纹理喷涂', detail: '调整喷枪参数，以专业喷涂手法喷涂主材层，形成仿石纹理' },
      { no: 5, title: '罩面保护', detail: '面层完全干燥后喷涂专用罩面漆，增强耐候性和防污性' },
    ],
    tools: ['专业喷枪', '空压机', '遮蔽膜'],
    tips: '喷涂时保持枪口与墙面距离均匀，约30-40厘米，运枪速度稳定，避免局部涂料堆积造成不均匀的纹理效果。',
    gradient: 'from-[#808080] to-[#505050]',
  },
  {
    id: 6,
    name: '金属质感漆处理',
    difficulty: '进阶工艺',
    duration: '10-16小时',
    desc: '运用专业工具和施工技巧，在墙面呈现出精致的金属光泽效果，彰显高贵典雅气质。',
    steps: [
      { no: 1, title: '基底打磨', detail: '基底进行精细打磨处理，确保表面光滑，用细砂纸研磨至200目以上' },
      { no: 2, title: '金属底漆', detail: '涂刷专用金属底漆，增强金属质感漆的附着力和效果表现' },
      { no: 3, title: '金属质感涂层', detail: '刷涂或滚涂金属质感漆，以专业手法体现金属流光质感' },
      { no: 4, title: '抛光处理', detail: '用抛光机对金属质感层进行轻柔抛光，提升金属光泽感' },
      { no: 5, title: '保护清漆', detail: '最后涂刷高光或哑光保护清漆，锁住金属效果，提升耐久性' },
    ],
    tools: ['砂纸', '抛光机', '专用金属漆刷'],
    tips: '金属质感漆施工对基底要求极高，需确保基底绝对平整光滑，任何细微不平整都会在金属效果下被放大显现。',
    gradient: 'from-[#C0C0C0] to-[#808080]',
  },
  {
    id: 7,
    name: '多层次艺术涂装',
    difficulty: '专业工艺',
    duration: '2-3天',
    desc: '综合运用多种材料和技法，创造出层次丰富、效果独特的艺术墙面，适合高端定制项目。',
    steps: [
      { no: 1, title: '设计方案', detail: '与业主沟通确认设计方案，选定颜色搭配和肌理效果，制作样板供确认' },
      { no: 2, title: '基底处理', detail: '彻底处理基底，批刮高级腻子找平，打磨至极度平整' },
      { no: 3, title: '底色层', detail: '涂刷底色涂料，确定整体色调基础，待完全干燥' },
      { no: 4, title: '肌理层', detail: '运用多种工具叠加创造肌理效果，体现材质的层次感' },
      { no: 5, title: '艺术效果层', detail: '施加特殊艺术效果层，如金粉、珠光等，提升高端质感' },
      { no: 6, title: '保护层', detail: '涂刷高档透明保护漆，保护艺术效果，增强耐久性' },
    ],
    tools: ['各类刷具', '喷枪', '特殊工具'],
    tips: '多层次涂装需要每层充分干燥后再施工下一层，切勿贪图速度，否则会导致层间结合不良，影响整体效果。',
    gradient: 'from-[#0A3D5C] to-[#E8A020]',
  },
  {
    id: 8,
    name: '特殊纹理创作',
    difficulty: '专业工艺',
    duration: '2-4天',
    desc: '凭借丰富的艺术素养和专业技巧，在墙面创作独一无二的特殊纹理装饰效果。',
    steps: [
      { no: 1, title: '创意设计', detail: '根据空间风格和业主要求，设计独特的纹理方案，绘制效果图' },
      { no: 2, title: '材料准备', detail: '准备多种质地的涂料和特种介质，配置所需的专业工具' },
      { no: 3, title: '基底制作', detail: '处理并强化基底，如需要可增加打底纹理层提升整体立体感' },
      { no: 4, title: '纹理创作', detail: '运用多种手法和工具，逐步创作独特纹理效果，注重整体协调性' },
      { no: 5, title: '效果保护', detail: '对完成的艺术效果进行多遍保护处理，确保长期保存' },
    ],
    tools: ['创意工具', '特种涂料', '保护漆'],
    tips: '特殊纹理创作具有很强的艺术性，建议在正式施工前先在样板上充分练习和测试，确认效果满意后再大面积施工。',
    gradient: 'from-[#8B4513] to-[#1E6B8C]',
  },
]

const difficultyColors: Record<string, string> = {
  '基础工艺': '#1E6B8C',
  '进阶工艺': '#E8A020',
  '专业工艺': '#0A3D5C',
}

export default function TechniquesPage() {
  const [activeLevel, setActiveLevel] = useState('全部')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = activeLevel === '全部'
    ? techniques
    : techniques.filter((t) => t.difficulty === activeLevel)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">首页</Link>
            <ChevronRight size={14} />
            <span>施工工艺</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">施工工艺</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            系统化的涂装施工工艺指南，从基础到专业，手把手教您掌握各类涂装技法，
            提升施工质量，打造精品工程。
          </p>
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            {[
              { label: '8个工艺教程', color: '#E8A020' },
              { label: '详细步骤分解', color: '#E8A020' },
              { label: '专业工具指导', color: '#E8A020' },
              { label: '施工小贴士', color: '#E8A020' },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-2">
                <CheckCircle size={16} style={{ color: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeLevel === level
                    ? 'bg-[#0A3D5C] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques List */}
      <section className="py-12 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {filtered.map((technique) => (
              <div key={technique.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {/* Left color bar + header */}
                  <div className={`md:w-64 flex-shrink-0 bg-gradient-to-br ${technique.gradient} text-white p-6 flex flex-col justify-between`}>
                    <div>
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 bg-white/20"
                      >
                        {technique.difficulty}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{technique.name}</h3>
                      <p className="text-sm opacity-80 leading-relaxed">{technique.desc}</p>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs opacity-60">预计用时</div>
                      <div className="font-semibold">{technique.duration}</div>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="flex-1 p-6">
                    {/* Steps preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#0A3D5C] mb-3 flex items-center space-x-2">
                        <span>施工步骤</span>
                        <span className="px-1.5 py-0.5 bg-[#F8F9FA] rounded text-xs text-gray-500">
                          {technique.steps.length}步
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(expandedId === technique.id ? technique.steps : technique.steps.slice(0, 3)).map((step) => (
                          <div key={step.no} className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-[#0A3D5C] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {step.no}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">{step.title}</div>
                              {expandedId === technique.id && (
                                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.detail}</div>
                              )}
                            </div>
                          </div>
                        ))}
                        {expandedId !== technique.id && technique.steps.length > 3 && (
                          <div className="text-xs text-gray-400 flex items-center pl-9">
                            ...还有 {technique.steps.length - 3} 个步骤
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-4">
                      {/* Tools */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                          <Wrench size={12} />
                          <span>所需工具</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {technique.tools.map((tool) => (
                            <span key={tool} className="px-2 py-0.5 bg-[#F8F9FA] border border-gray-200 rounded text-xs text-gray-600">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    {expandedId === technique.id && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                        <Lightbulb size={16} className="text-[#E8A020] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{technique.tips}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
                      className="text-sm font-medium text-[#1E6B8C] hover:text-[#0A3D5C] transition-colors flex items-center space-x-1"
                    >
                      <span>{expandedId === technique.id ? '收起详情' : '查看详情'}</span>
                      <ChevronRight size={16} className={`transition-transform ${expandedId === technique.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start space-x-4">
            <AlertCircle size={24} className="text-[#1E6B8C] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#0A3D5C] mb-2">施工安全提示</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 施工时确保通风良好，佩戴防护口罩和手套</li>
                <li>• 避免在过高或过低温度下施工，最佳施工温度为10℃-35℃</li>
                <li>• 施工材料远离儿童，避免接触眼睛和皮肤</li>
                <li>• 如需高空作业，必须使用合格脚手架，系好安全带</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#0A3D5C] to-[#1E6B8C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">想系统学习专业施工技法？</h2>
          <p className="text-blue-100 mb-6">报名我们的专业培训课程，在专业讲师指导下实操练习，快速掌握施工技能</p>
          <Link
            href="/courses"
            className="inline-block px-8 py-3 rounded-lg font-bold text-[#0A3D5C] bg-[#E8A020] hover:opacity-90 transition-all duration-200"
          >
            报名培训课程
          </Link>
        </div>
      </section>
    </div>
  )
}

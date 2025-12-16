import { useState, useEffect } from 'react'
import { account, databases } from './appwrite'

// 数据库和表配置
const DATABASE_ID = '69411cc40015de9bf700'
const TABLE_ID = '69411cc600041a9ec5fd'

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  
  // 留言板状态
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    experienceLevel: '',
    currentUseCase: '',
    aiFeatureRequest: '',
    priority: '',
    detailedDescription: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (e) => {
    e.preventDefault()
    try {
      await account.createEmailPasswordSession(email, password)
      await checkUser()
    } catch (error) {
      alert(error.message)
    }
  }

  const register = async (e) => {
    e.preventDefault()
    try {
      await account.create('unique()', email, password, name)
      await login(e)
    } catch (error) {
      alert(error.message)
    }
  }

  const logout = async () => {
    await account.deleteSession('current')
    setUser(null)
    setCurrentStep(0)
    setFormData({
      experienceLevel: '',
      currentUseCase: '',
      aiFeatureRequest: '',
      priority: '',
      detailedDescription: ''
    })
    setSubmitSuccess(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return formData.experienceLevel !== ''
      case 1:
        return formData.currentUseCase !== ''
      case 2:
        return formData.aiFeatureRequest !== ''
      case 3:
        return formData.priority !== ''
      default:
        return true
    }
  }

  const submitSuggestion = async () => {
    setIsSubmitting(true)
    try {
      await databases.createDocument(
        DATABASE_ID,
        TABLE_ID,
        'unique()',
        {
          userId: user.$id,
          userName: user.name || user.email,
          userEmail: user.email,
          experienceLevel: formData.experienceLevel,
          currentUseCase: formData.currentUseCase,
          aiFeatureRequest: formData.aiFeatureRequest,
          priority: formData.priority,
          detailedDescription: formData.detailedDescription
        }
      )
      setSubmitSuccess(true)
      setTimeout(() => {
        setCurrentStep(0)
        setFormData({
          experienceLevel: '',
          currentUseCase: '',
          aiFeatureRequest: '',
          priority: '',
          detailedDescription: ''
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      alert('提交失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <h3>第1步：您的OceanBase使用经验</h3>
            <p>请告诉我们您使用OceanBase数据库的经验水平：</p>
            <div className="options-grid">
              {['新手（刚开始了解）', '中级（有实际项目经验）', '高级（深度使用和优化）', '专家（架构设计和调优）'].map((level) => (
                <button
                  key={level}
                  className={`option-btn ${formData.experienceLevel === level ? 'selected' : ''}`}
                  onClick={() => handleInputChange('experienceLevel', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 1:
        return (
          <div className="step-content">
            <h3>第2步：当前使用场景</h3>
            <p>您目前在什么场景下使用OceanBase数据库？</p>
            <div className="options-grid">
              {[
                '金融交易系统',
                '电商高并发场景', 
                '大数据分析平台',
                '物联网数据处理',
                '企业核心业务系统',
                '其他场景'
              ].map((useCase) => (
                <button
                  key={useCase}
                  className={`option-btn ${formData.currentUseCase === useCase ? 'selected' : ''}`}
                  onClick={() => handleInputChange('currentUseCase', useCase)}
                >
                  {useCase}
                </button>
              ))}
            </div>
            {formData.currentUseCase === '其他场景' && (
              <input
                type="text"
                placeholder="请具体描述您的使用场景..."
                className="custom-input"
                onChange={(e) => handleInputChange('currentUseCase', e.target.value)}
              />
            )}
          </div>
        )
      
      case 2:
        return (
          <div className="step-content">
            <h3>第3步：AI功能需求</h3>
            <p>您希望OceanBase在AI应用方面增加哪些功能？</p>
            <div className="options-grid">
              {[
                '智能SQL优化建议',
                '自动索引推荐',
                '异常检测与预警',
                '性能瓶颈智能诊断',
                '资源使用预测',
                '自适应参数调优',
                '其他AI功能'
              ].map((feature) => (
                <button
                  key={feature}
                  className={`option-btn ${formData.aiFeatureRequest === feature ? 'selected' : ''}`}
                  onClick={() => handleInputChange('aiFeatureRequest', feature)}
                >
                  {feature}
                </button>
              ))}
            </div>
            {formData.aiFeatureRequest === '其他AI功能' && (
              <input
                type="text"
                placeholder="请具体描述您期望的AI功能..."
                className="custom-input"
                onChange={(e) => handleInputChange('aiFeatureRequest', e.target.value)}
              />
            )}
          </div>
        )
      
      case 3:
        return (
          <div className="step-content">
            <h3>第4步：功能优先级</h3>
            <p>您认为这个AI功能对您的重要程度如何？</p>
            <div className="options-grid">
              {[
                '低优先级（nice to have）',
                '中等优先级（would be helpful）',
                '高优先级（very important）',
                '紧急优先级（critical for my business）'
              ].map((priority) => (
                <button
                  key={priority}
                  className={`option-btn ${formData.priority === priority ? 'selected' : ''}`}
                  onClick={() => handleInputChange('priority', priority)}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="step-content">
            <h3>第5步：详细描述（可选）</h3>
            <p>请提供更多关于您建议的详细信息，帮助我们更好地理解您的需求：</p>
            <textarea
              placeholder="例如：具体的使用场景、期望的效果、遇到的痛点等..."
              className="detailed-textarea"
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
              rows="6"
            />
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return <div className="container"><p>Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="container auth-container">
        <h1>🌊 OceanBase AI产品建议留言板</h1>
        <p className="subtitle">为OceanBase数据库的AI功能发展贡献您的宝贵建议！</p>
        
        <form onSubmit={login} className="auth-form">
          <h2>登录</h2>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">登录</button>
        </form>
        
        <form onSubmit={register} className="auth-form">
          <h2>注册新账户</h2>
          <input
            type="text"
            placeholder="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">注册</button>
        </form>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="container success-container">
        <div className="success-message">
          <h2>🎉 感谢您的建议！</h2>
          <p>您的宝贵意见已成功提交给OceanBase团队！</p>
          <p>这将帮助我们打造更好的AI数据库产品！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container suggestion-container">
      <div className="header">
        <h1>🌊 OceanBase AI产品建议留言板</h1>
        <p className="subtitle">帮助我们打造更智能的OceanBase数据库！</p>
        <div className="user-info">
          <span>欢迎, {user.name || user.email}!</span>
          <button onClick={logout} className="logout-btn">退出</button>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
        />
      </div>
      
      <div className="steps-indicator">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step}
            className={`step-dot ${currentStep >= step - 1 ? 'active' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="form-wrapper">
        {renderStepContent()}
        
        <div className="form-actions">
          {currentStep > 0 && (
            <button onClick={prevStep} className="btn-secondary">
              上一步
            </button>
          )}
          
          {currentStep < 4 ? (
            <button 
              onClick={nextStep} 
              disabled={!validateStep()}
              className="btn-primary"
            >
              下一步
            </button>
          ) : (
            <button 
              onClick={submitSuggestion}
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? '提交中...' : '提交建议'}
            </button>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 为什么我们需要您的建议？</h3>
        <p>
          OceanBase正在积极探索AI技术在数据库领域的应用。您的真实使用体验和需求，
          将帮助我们开发出真正有价值的AI功能，让数据库变得更智能、更易用！
        </p>
      </div>
    </div>
  )
}

export default App
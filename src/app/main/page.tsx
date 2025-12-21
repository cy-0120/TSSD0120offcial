'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import MetallicCard from '../components/MetallicCard'

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 초기 로드 시 자동 스크롤 방지
  useEffect(() => {
    // 브라우저의 자동 스크롤 복원 비활성화
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    
    // 페이지 로드 시 항상 맨 위로 스크롤
    const scrollToTop = () => {
      window.scrollTo(0, 0)
    }
    
    // 즉시 실행
    scrollToTop()
    
    // 약간의 지연 후에도 다시 확인 (hydration 후 스크롤 방지)
    const timeout1 = setTimeout(scrollToTop, 100)
    const timeout2 = setTimeout(scrollToTop, 500)
    const timeout3 = setTimeout(scrollToTop, 1000)
    
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
    }
  }, [])

  // 완성도에 따른 색상 클래스 반환
  const getCompletionColorClass = (percentage: number) => {
    if (percentage >= 90) return styles.completionHigh
    if (percentage > 60 && percentage < 90) return styles.completionMedium
    if (percentage <= 60) return styles.completionLow
    return styles.completionLow
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    closeMenu()
    
    // 모든 섹션이 항상 표시되므로 스크롤만 실행
    setTimeout(() => {
      const element = document.getElementById(targetId)
      if (element) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            // About Me와 동료들은 섹션 상단에 정확히 맞추기
            const offsetPosition = (targetId === 'about' || targetId === 'contact')
              ? elementPosition 
              : elementPosition - 20 // 다른 섹션은 약간의 여백
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          })
        })
      }
    }, 100)
  }

  return (
    <div className={styles.mainContainer}>
      {/* 햄버거 메뉴 */}
      <div className={styles.menuContainer}>
        <button 
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="메뉴 열기"
        >
          <span className={styles.menuIcon}>
            <span className={styles.menuLine}></span>
            <span className={styles.menuLine}></span>
            <span className={styles.menuLine}></span>
          </span>
        </button>
        
        {isMenuOpen && (
          <>
            <div className={styles.menuOverlay} onClick={closeMenu}></div>
            <div className={styles.dropdownMenu}>
              <a 
                href="#profile" 
                className={styles.menuItem} 
                onClick={(e) => handleMenuClick(e, 'profile')}
              >
                홈
              </a>
              <a 
                href="#about" 
                className={styles.menuItem} 
                onClick={(e) => handleMenuClick(e, 'about')}
              >
                About Me
              </a>
              <a 
                href="#projects" 
                className={styles.menuItem} 
                onClick={(e) => handleMenuClick(e, 'projects')}
              >
                프로젝트
              </a>
              <a 
                href="#contact" 
                className={styles.menuItem} 
                onClick={(e) => handleMenuClick(e, 'contact')}
              >
                동료들
              </a>
            </div>
          </>
        )}
      </div>

      {/* 3D 금속 명함 - 중앙 */}
      <div id="profile">
        <MetallicCard />
      </div>

      <div className={styles.content}>
        {/* About Me 섹션 - 명함 스타일 */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutCard}>
            <div className={styles.profileImage}>
              <img 
                src="/Rupital.jpg" 
                alt="Rupital0815 Logo" 
                className={styles.profileLogo}
              />
            </div>
            <h1 className={styles.name}>Rupital0815</h1>
            <p className={styles.greeting}>안녕하세요</p>
            <p className={styles.intro}>
              프론트엔드와 보안에 관심이 많은 개발자입니다.
            </p>
            
            <h2 className={styles.sectionTitle}>About Me</h2>
            <p className={styles.description}>
              안녕하세요! 저는 Rupital0815입니다.
              <br />
              프론트엔드와 보안 전문가를 목표를 하고 있습니다.
              <br />
              웹의 구성, 디자인, 보안에 관심이 많으며 많은 사용자의 편리를 우선시 하는 개발을 추구합니다.
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>18세</div>
                <div className={styles.statLabel}>고등학생</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>학생</div>
                <div className={styles.statLabel}>직업</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1년</div>
                <div className={styles.statLabel}>개발 경험</div>
              </div>
            </div>
          </div>
        </section>

        {/* 프로젝트 섹션 */}
        <section id="projects" className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.projectsGrid}>
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>Rupital Official Web</h3>
                <div className={styles.statusContainer}>
                  <span className={styles.projectStatus}>활성</span>
                  <span className={styles.completionLabel}>완성도</span>
                  <div className={styles.activityBar}>
                    <div 
                      className={`${styles.activityFill} ${getCompletionColorClass(100)}`} 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className={styles.projectDescription}>
                Rupital0815의 공식 사이트 입니다.
              </p>
              <div className={styles.projectTech}>
                <span className={styles.techTag}>Next.js</span>
                <span className={styles.techTag}>Node.js</span>
                <span className={styles.techTag}>TypeScript</span>
                <span className={styles.techTag}>HTML</span>
                <span className={styles.techTag}>CSS</span>
              </div>
            </div>
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <a 
                  href="https://ade.dksh.site" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.projectTitleLink}
                >
                  <h3 className={styles.projectTitle}>ADE</h3>
                </a>
                <div className={styles.statusContainer}>
                  <span className={styles.projectStatus}>활성</span>
                  <span className={styles.completionLabel}>완성도</span>
                  <div className={styles.activityBar}>
                    <div 
                      className={`${styles.activityFill} ${getCompletionColorClass(65)}`} 
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className={styles.projectDescription}>
               자율주행 차량 개발부인 ADE의 공식 홈페이지 입니다.
              </p>
              <div className={styles.projectTech}>
                <span className={styles.techTag}>Next.js</span>
                <span className={styles.techTag}>TypeScript</span>
                <span className={styles.techTag}>HTML</span>
                <span className={styles.techTag}>CSS</span>
                <span className={styles.techTag}>반응형 CSS 프레임워크</span>
              </div>
            </div>
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>genshin illust</h3>
                <div className={styles.statusContainer}>
                  <span className={`${styles.projectStatus} ${styles.projectStatusInactive}`}>비활성</span>
                  <span className={styles.completionLabel}>완성도</span>
                  <div className={styles.activityBar}>
                    <div 
                      className={`${styles.activityFill} ${getCompletionColorClass(40)}`} 
                      style={{ width: '40%' }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className={styles.projectDescription}>
                원신의 일러스트래이트 관련 홈페이지 입니다.
              </p>
              <div className={styles.projectReason}>
                <span className={styles.reasonLabel}>비활성 사유:최적화 문재로 인한 일시 비활성</span>
              </div>
              <div className={styles.projectTech}>
                <span className={styles.techTag}>HTML</span>
                <span className={styles.techTag}>CSS</span>
                <span className={styles.techTag}>JS</span>
                <span className={styles.techTag}>F12 감지 툴</span>
              </div>
            </div>
          </div>
        </section>

        {/* 동료들 섹션 */}
        <section id="contact" className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>함깨 하는 동료들</h2>
          <div className={styles.colleaguesGrid}>
            <div className={styles.colleagueCard}>
              <a 
                href="https://misty6760.kro.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.colleagueNameLink}
              >
                <h3 className={styles.colleagueName}>Misty6760</h3>
              </a>
              <div className={styles.colleagueInfo}>
                <p className={styles.colleagueDescription}>함깨 웹을 만드며 난관을 같이 극복하는 친구</p>
              </div>
            </div>
            <div className={styles.colleagueCard}>
              <a 
                href="https://leesw123.dev/business_card" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.colleagueNameLink}
              >
                <h3 className={styles.colleagueName}>leesw123</h3>
              </a>
              <div className={styles.colleagueInfo}>
                <p className={styles.colleagueDescription}>나에게 웹과 보안을 알려주며 부족한 부분을 알려주는 친구</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


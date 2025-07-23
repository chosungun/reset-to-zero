// tv-boot.js - TV 부팅 시퀀스 & 이미지 노이즈 효과

class TVBootSystem {
    constructor() {
        this.noiseImages = [
            '../assets/images/background1.jpg',
            '../assets/images/background3.jpg', 
            '../assets/images/background5.jpg',
            '../assets/images/background6.jpg',
            '../assets/images/background8.jpg',
            '../assets/images/background9.jpg',
            '../assets/images/background11.jpg',
            '../assets/images/background12.jpg'  // 10 → 12로 변경
        ];
        
        this.currentImageIndex = 0;
        this.noiseLayers = [];
        this.noiseTimeline = null;
        this.isBooted = false;
        
        this.init();
    }
    
    init() {
        this.setupNoiseElements();
        this.initGSAPTimeline();
        this.bindEvents();
    }
    
    // 노이즈 레이어 DOM 요소들 설정
    setupNoiseElements() {
        console.log('=== DOM 요소 체크 시작 ===');
        
        this.noiseLayers = document.querySelectorAll('.noise-layer');
        console.log('찾은 .noise-layer 요소 수:', this.noiseLayers.length);
        
        if (this.noiseLayers.length === 0) {
            console.error('❌ .noise-layer 요소가 하나도 없습니다!');
            console.log('HTML 구조를 확인해주세요.');
            
            // 강제로 noise-layer 요소들 만들기
            const screen = document.querySelector('.screen');
            if (screen) {
                console.log('✅ .screen 요소 찾았습니다. noise-layer 요소들을 생성합니다.');
                
                for (let i = 0; i < 8; i++) {
                    const noiseLayer = document.createElement('div');
                    noiseLayer.className = 'noise-layer';
                    noiseLayer.id = `noise${i + 1}`;
                    noiseLayer.style.cssText = `
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        background-size: cover !important;
                        background-position: center !important;
                        background-repeat: no-repeat !important;
                        opacity: 0 !important;
                        z-index: ${10 + i} !important;
                        pointer-events: none !important;
                        border: 3px solid lime !important;
                    `;
                    screen.appendChild(noiseLayer);
                    console.log(`생성됨: noise${i + 1}`);
                }
                
                // 다시 검색
                this.noiseLayers = document.querySelectorAll('.noise-layer');
                console.log('생성 후 .noise-layer 요소 수:', this.noiseLayers.length);
            } else {
                console.error('❌ .screen 요소도 없습니다! HTML 구조를 확인해주세요.');
                return;
            }
        }
        
        // 각 레이어 정보 출력
        this.noiseLayers.forEach((layer, index) => {
            console.log(`레이어 ${index}:`, layer.id, layer.getBoundingClientRect());
        });
        
        // 초기 설정: 모든 레이어 숨기기
        gsap.set(this.noiseLayers, { opacity: 0 });
        console.log('=== DOM 요소 체크 완료 ===');
    }
    
    // GSAP 타임라인 초기화
    initGSAPTimeline() {
        this.noiseTimeline = gsap.timeline({ 
            repeat: -1,
            paused: true // 부팅 완료 후 시작
        });
    }
    
    // 이벤트 바인딩
    bindEvents() {
        // 스페이스바로 이미지 랜덤 변경
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.triggerRandomImage();
            }
        });
        
        // 클릭으로 강한 글리치 효과
        document.addEventListener('click', () => {
            this.triggerGlitchEffect();
        });
    }
    
    // TV 부팅 시퀀스 시작
    startBootSequence() {
        const bootText = document.getElementById('bootText');
        const loadingProgress = document.getElementById('loadingProgress');
        
        if (!bootText || !loadingProgress) {
            console.warn('부팅 UI 요소들이 없습니다.');
            this.startImageSequence(); // 바로 이미지 시퀀스 시작
            return;
        }
        
        // 로딩 바 애니메이션
        gsap.to(loadingProgress, {
            width: '100%',
            duration: 3,
            ease: "power2.inOut"
        });
        
        // 부팅 텍스트 페이드 인
        gsap.to(bootText, {
            opacity: 1,
            duration: 0.5,
            delay: 0.5
        });
        
        // 2초 후 이미지 시퀀스 시작
        gsap.delayedCall(2, () => {
            this.startImageSequence();
            this.isBooted = true;
        });
    }
    
    // 이미지 시퀀스 생성 및 시작
    startImageSequence() {
        this.createImageSequence();
        this.noiseTimeline.play();
    }
    
    // 부드러운 이미지 전환 타임라인 생성
    createImageSequence() {
        this.noiseTimeline.clear(); // 기존 타임라인 클리어
        
        // 디버깅: 이미지 경로와 레이어 확인
        console.log('이미지 배열:', this.noiseImages);
        console.log('노이즈 레이어 수:', this.noiseLayers.length);
        
        this.noiseImages.forEach((imageSrc, index) => {
            const layerIndex = index % this.noiseLayers.length;
            const layer = this.noiseLayers[layerIndex];
            
            // 디버깅: 각 레이어 확인
            console.log(`레이어 ${index}:`, layer, '이미지:', imageSrc);
            
            // 이미지 미리 로드하고 설정
            const img = new Image();
            img.onload = () => {
                console.log(`✅ 이미지 로드 성공: ${imageSrc}`);
                layer.style.setProperty('background-image', `url('${imageSrc}')`, 'important');
                layer.style.setProperty('background-size', 'cover', 'important');
                layer.style.setProperty('background-position', 'center', 'important');
                layer.style.setProperty('background-repeat', 'no-repeat', 'important');
            };
            img.onerror = () => {
                console.error(`❌ 이미지 로드 실패: ${imageSrc}`);
                // 이미지 로드 실패시 컬러 그라디언트로 대체
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                layer.style.setProperty('background', `linear-gradient(45deg, ${randomColor}, #000)`, 'important');
            };
            img.src = imageSrc;
            
            // 0.5초마다 페이드 인/아웃 (더 명확하게)
            this.noiseTimeline
                .to(layer, {
                    opacity: 0.8,
                    duration: 0.2,
                    ease: "power2.inOut"
                }, index * 0.5)
                .to(layer, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.inOut"
                }, index * 0.5 + 0.2);
        });
        
        // 강제로 첫 번째 이미지 테스트 (더 강력하게)
        setTimeout(() => {
            console.log('=== 강제 테스트 시작 ===');
            const firstLayer = this.noiseLayers[0];
            
            // 모든 스타일 강제 적용
            firstLayer.style.setProperty('background-image', `url('${this.noiseImages[0]}')`, 'important');
            firstLayer.style.setProperty('opacity', '1', 'important');
            firstLayer.style.setProperty('z-index', '999', 'important');
            firstLayer.style.setProperty('display', 'block', 'important');
            firstLayer.style.setProperty('visibility', 'visible', 'important');
            
            console.log('첫 번째 레이어 element:', firstLayer);
            console.log('background-image:', firstLayer.style.backgroundImage);
            console.log('opacity:', firstLayer.style.opacity);
            console.log('z-index:', firstLayer.style.zIndex);
            
            // 빨간 테두리가 보이는지 확인
            console.log('빨간 테두리가 화면에 보이나요?');
        }, 1000);
        
        // 5초 후 두 번째 이미지로 전환 테스트
        setTimeout(() => {
            console.log('=== 두 번째 이미지 테스트 ===');
            // 첫 번째 숨기기
            this.noiseLayers[0].style.setProperty('opacity', '0', 'important');
            
            // 두 번째 보이기
            const secondLayer = this.noiseLayers[1];
            secondLayer.style.setProperty('background-image', `url('${this.noiseImages[1]}')`, 'important');
            secondLayer.style.setProperty('opacity', '1', 'important');
            secondLayer.style.setProperty('z-index', '999', 'important');
            
            console.log('두 번째 이미지로 전환:', this.noiseImages[1]);
        }, 5000);
    }
    
    // 랜덤 이미지 효과
    triggerRandomImage() {
        if (!this.isBooted) return;
        
        this.currentImageIndex = Math.floor(Math.random() * this.noiseImages.length);
        const randomLayer = this.noiseLayers[Math.floor(Math.random() * this.noiseLayers.length)];
        
        randomLayer.style.backgroundImage = `url('${this.noiseImages[this.currentImageIndex]}')`;
        
        gsap.to(randomLayer, {
            opacity: 0.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
    
    // 글리치 효과
    triggerGlitchEffect() {
        if (!this.isBooted) return;
        
        const randomIntensity = Math.random() * 20 + 10;
        
        this.noiseLayers.forEach(layer => {
            gsap.to(layer, {
                opacity: Math.random() * 0.8,
                x: Math.random() * randomIntensity - randomIntensity/2,
                y: Math.random() * randomIntensity - randomIntensity/2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    }
    
    // 노이즈 효과 일시정지/재생
    toggleNoise() {
        if (this.noiseTimeline.paused()) {
            this.noiseTimeline.play();
        } else {
            this.noiseTimeline.pause();
        }
    }
    
    // 이미지 변경 속도 조절
    setSpeed(speed = 1) {
        this.noiseTimeline.timeScale(speed);
    }
    
    // 정리 (메모리 해제)
    destroy() {
        if (this.noiseTimeline) {
            this.noiseTimeline.kill();
        }
        
        document.removeEventListener('keydown', this.bindEvents);
        document.removeEventListener('click', this.bindEvents);
    }
}

// 전역에서 사용할 수 있도록 내보내기
window.TVBootSystem = TVBootSystem;

// DOM 로드 완료 후 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    // GSAP 로드 확인
    if (typeof gsap === 'undefined') {
        console.error('GSAP이 로드되지 않았습니다. GSAP CDN을 추가해주세요.');
        return;
    }
    
    // TV 부팅 시스템 초기화
    const tvBoot = new TVBootSystem();
    
    // 페이지 로드 완료 후 부팅 시작
    window.addEventListener('load', () => {
        tvBoot.startBootSequence();
    });
    
    // 전역 접근을 위해 window에 등록
    window.tvBootInstance = tvBoot;
});

// 유틸리티 함수들
const TVBootUtils = {
    // 이미지 프리로드
    preloadImages(imageArray) {
        const promises = imageArray.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        });
        
        return Promise.all(promises);
    },
    
    // CRT 글로우 효과
    addCRTGlow(element, intensity = 0.3) {
        gsap.set(element, {
            boxShadow: `0 0 20px rgba(0,255,0,${intensity})`
        });
    },
    
    // 타이핑 효과
    typeText(element, text, speed = 50) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }
};

window.TVBootUtils = TVBootUtils;
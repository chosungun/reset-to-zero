// Main Application Controller
class AnnLeeApp {
    constructor() {
        this.isLoaded = false;
        this.components = {};
        this.init();
    }

    init() {
        // DOM이 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('🎬 AnnLee Project Starting...');
        
        // 타이핑 효과 시작
        setTimeout(() => {
            this.startTypingEffect();
        }, 1500);
        
        this.isLoaded = true;
    }

    startTypingEffect() {
        console.log('✨ Starting modern typing effect...');
        // typing-effect.js에서 자동으로 시작됨
    }
}

// 전역 앱 인스턴스 생성
window.annLeeApp = new AnnLeeApp();
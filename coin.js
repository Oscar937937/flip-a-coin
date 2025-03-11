// 教學系統
class TutorialSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.customPositions = {};
        this.isSettingPosition = false;
        this.setupEventListeners();
        this.createHighlightBox();
    }

    createHighlightBox() {
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        highlight.style.display = 'none';
        document.body.appendChild(highlight);
    }

    setupEventListeners() {
        document.getElementById('tutorialButton').addEventListener('click', () => {
            if (this.isSettingPosition) {
                alert('請先完成位置設置');
                return;
            }
            this.showTutorial();
        });

        // 添加控制按鈕到 body
        const controls = document.createElement('div');
        controls.className = 'tutorial-controls';
        controls.style.display = 'none';
        controls.innerHTML = `
            <button id="prevStep">上一步</button>
            <span id="stepIndicator">1 / 5</span>
            <button id="nextStep">下一步</button>
            <button id="setPositions">設置位置</button>
        `;
        document.body.appendChild(controls);

        document.getElementById('prevStep').addEventListener('click', () => this.prevStep());
        document.getElementById('nextStep').addEventListener('click', () => this.nextStep());
        
        // 修改設置位置按鈕的事件處理
        document.getElementById('setPositions').addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            if (!this.isSettingPosition) {
                this.startPositionSetting();
            }
        });

        // 添加滑鼠移動事件來預覽位置
        document.addEventListener('mousemove', (e) => {
            if (this.isSettingPosition) {
                const pointer = document.querySelector('.tutorial-pointer');
                pointer.style.left = `${e.clientX}px`;
                pointer.style.top = `${e.clientY}px`;
                
                const textElement = pointer.querySelector('.tutorial-text');
                const stepNames = {
                    1: '硬幣位置',
                    2: '猜數字按鈕',
                    3: '猜圖案按鈕',
                    4: '排行榜',
                    5: '教學按鈕'
                };
                textElement.textContent = `設置第 ${this.currentStep} 個位置：${stepNames[this.currentStep]}`;
                pointer.classList.add('active');
            }
        });

        // 修改點擊事件處理
        document.addEventListener('click', (e) => {
            if (this.isSettingPosition) {
                // 檢查點擊的不是控制按鈕
                if (!e.target.closest('.tutorial-controls')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setCustomPosition(e.clientX, e.clientY);
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.isVisible()) {
                if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    this.nextStep();
                } else if (e.key === 'ArrowLeft') {
                    this.prevStep();
                } else if (e.key === 'Escape') {
                    if (this.isSettingPosition) {
                        this.cancelPositionSetting();
                    } else {
                        this.hideTutorial();
                    }
                }
            }
        });
    }

    startPositionSetting() {
        this.isSettingPosition = true;
        this.currentStep = 1;
        this.customPositions = {};
        document.body.style.cursor = 'crosshair';
        
        // 顯示預覽
        const pointer = document.querySelector('.tutorial-pointer');
        pointer.classList.add('active');
        const textElement = pointer.querySelector('.tutorial-text');
        textElement.textContent = '設置第 1 個位置：硬幣位置';
    }

    cancelPositionSetting() {
        this.isSettingPosition = false;
        document.body.style.cursor = 'default';
        document.querySelector('.tutorial-pointer').classList.remove('active');
        alert('已取消位置設置');
    }

    setCustomPosition(x, y) {
        if (!this.isSettingPosition) return;

        this.customPositions[this.currentStep] = { x, y };
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            const stepNames = {
                1: '硬幣位置',
                2: '猜數字按鈕',
                3: '猜圖案按鈕',
                4: '排行榜',
                5: '教學按鈕'
            };
            const textElement = document.querySelector('.tutorial-pointer .tutorial-text');
            textElement.textContent = `設置第 ${this.currentStep} 個位置：${stepNames[this.currentStep]}`;
        } else {
            this.isSettingPosition = false;
            document.body.style.cursor = 'default';
            document.querySelector('.tutorial-pointer').classList.remove('active');
            alert('位置設置完成！');
            localStorage.setItem('tutorialPositions', JSON.stringify(this.customPositions));
        }
    }

    loadCustomPositions() {
        const saved = localStorage.getItem('tutorialPositions');
        if (saved) {
            this.customPositions = JSON.parse(saved);
        }
    }

    isVisible() {
        return document.querySelector('.tutorial-pointer').classList.contains('active');
    }

    showTutorial() {
        this.currentStep = 1;
        this.loadCustomPositions();
        document.querySelector('.tutorial-controls').style.display = 'flex';
        document.querySelector('.tutorial-highlight').style.display = 'block';
        this.updateTutorialContent();
    }

    hideTutorial() {
        const pointer = document.querySelector('.tutorial-pointer');
        pointer.classList.remove('active');
        document.querySelector('.tutorial-controls').style.display = 'none';
        document.querySelector('.tutorial-highlight').style.display = 'none';
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateTutorialContent();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateTutorialContent();
        } else {
            this.hideTutorial();
        }
    }

    updateTutorialContent() {
        const pointer = document.querySelector('.tutorial-pointer');
        const highlight = document.querySelector('.tutorial-highlight');
        pointer.classList.add('active');
        
        // 更新步驟指示器
        document.getElementById('stepIndicator').textContent = `${this.currentStep} / ${this.totalSteps}`;
        
        // 更新按鈕狀態
        document.getElementById('prevStep').disabled = this.currentStep === 1;
        document.getElementById('nextStep').textContent = this.currentStep === this.totalSteps ? '完成' : '下一步';

        const elements = {
            1: { selector: '.coin', text: '這是硬幣，點擊按鈕開始猜測！', padding: 20 },
            2: { selector: '#guessHeads', text: '點擊這裡猜測硬幣正面（數字）', padding: 10 },
            3: { selector: '#guessTails', text: '點擊這裡猜測硬幣反面（圖案）', padding: 10 },
            4: { selector: '#leaderboard', text: '這裡顯示排行榜，記錄你的最高分數', padding: 10 },
            5: { selector: '#tutorialButton', text: '隨時點擊這裡可以再次查看教學', padding: 10 }
        };

        const element = elements[this.currentStep];
        const targetElement = document.querySelector(element.selector);
        
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            
            // 設置高亮框位置和大小
            highlight.style.top = `${rect.top - element.padding}px`;
            highlight.style.left = `${rect.left - element.padding}px`;
            highlight.style.width = `${rect.width + element.padding * 2}px`;
            highlight.style.height = `${rect.height + element.padding * 2}px`;

            // 設置指示器位置
            if (this.customPositions[this.currentStep]) {
                const pos = this.customPositions[this.currentStep];
                pointer.style.left = `${pos.x}px`;
                pointer.style.top = `${pos.y}px`;
            } else {
                pointer.style.left = `${rect.left + rect.width / 2}px`;
                pointer.style.top = `${rect.top - 60}px`;
            }

            // 設置文本
            const textElement = pointer.querySelector('.tutorial-text');
            textElement.textContent = element.text;
            textElement.style.top = '-80px';
            textElement.style.left = '50%';
        }
    }
}

// 用戶系統
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.dailyLeaderboard = JSON.parse(localStorage.getItem('dailyLeaderboard')) || {};
        this.lastResetDate = localStorage.getItem('lastResetDate');
        this.tutorialSystem = new TutorialSystem();
        this.setupEventListeners();
        this.checkLoginStatus();
        this.checkAndResetDailyLeaderboard();
    }

    checkAndResetDailyLeaderboard() {
        const today = new Date().toDateString();
        if (this.lastResetDate !== today) {
            this.dailyLeaderboard = {};
            localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
            localStorage.setItem('lastResetDate', today);
        }
    }

    setupEventListeners() {
        // 登入表單處理
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            this.login(username, password);
        });

        // 註冊表單處理
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            this.register(username, password, confirmPassword);
        });

        // 切換登入/註冊表單
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showGame();
        }
    }

    login(username, password) {
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.showGame();
            
            // 檢查是否第一次登入
            if (!this.users[username].hasSeenTutorial) {
                this.tutorialSystem.showTutorial();
                // 標記已看過教學
                this.users[username].hasSeenTutorial = true;
                localStorage.setItem('users', JSON.stringify(this.users));
            }
        } else {
            alert('用戶名或密碼錯誤！');
        }
    }

    register(username, password, confirmPassword) {
        if (password !== confirmPassword) {
            alert('兩次輸入的密碼不一致！');
            return;
        }

        if (this.users[username]) {
            alert('用戶名已存在！');
            return;
        }

        this.users[username] = {
            password: password,
            highestScore: 0,
            hasSeenTutorial: false  // 添加標記表示是否看過教學
        };

        localStorage.setItem('users', JSON.stringify(this.users));
        alert('註冊成功！');
        this.showLoginForm();
    }

    showLoginForm() {
        document.getElementById('authContainer').classList.add('active');
        document.getElementById('registerContainer').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('authContainer').classList.remove('active');
        document.getElementById('registerContainer').classList.add('active');
    }

    showGame() {
        document.getElementById('authContainer').classList.remove('active');
        document.getElementById('registerContainer').classList.remove('active');
        document.getElementById('gameContainer').classList.add('active');
        this.updateUserInfo();
        // 顯示排行榜
        if (window.game) {
            window.game.displayLeaderboard();
        }
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
            歡迎，${this.currentUser}！
            <button onclick="userSystem.logout()">登出</button>
            <button onclick="userSystem.deleteAccount()" style="background-color: #ff4444;">注銷帳戶</button>
        `;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('gameContainer').classList.remove('active');
        document.getElementById('authContainer').classList.add('active');
        document.getElementById('userInfo').innerHTML = '';
    }

    saveScore(score) {
        if (!this.currentUser || score <= 0) return; // 只有當分數大於0時才記錄

        // 更新用戶的最高分
        if (!this.users[this.currentUser].highestScore || score > this.users[this.currentUser].highestScore) {
            this.users[this.currentUser].highestScore = score;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // 更新每日排行榜（只保存每個用戶當天的最高分）
        if (!this.dailyLeaderboard[this.currentUser] || score > this.dailyLeaderboard[this.currentUser]) {
            this.dailyLeaderboard[this.currentUser] = score;
            localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
        }
    }

    getDailyLeaderboard() {
        const scores = [];
        for (const username in this.dailyLeaderboard) {
            const score = this.dailyLeaderboard[username];
            if (score > 0) {  // 只添加大於0的分數
                scores.push({
                    username: username,
                    score: score
                });
            }
        }
        return scores.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    getAllTimeLeaderboard() {
        const allTimeScores = [];
        for (const username in this.users) {
            const score = this.users[username].highestScore || 0;
            if (score > 0) {  // 只添加大於0的分數
                allTimeScores.push({
                    username: username,
                    score: score
                });
            }
        }
        return allTimeScores.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    deleteAccount() {
        if (!this.currentUser) return;
        
        const confirmDelete = confirm('確定要注銷帳戶嗎？此操作不可逆！');
        if (confirmDelete) {
            // 從用戶列表中刪除
            delete this.users[this.currentUser];
            localStorage.setItem('users', JSON.stringify(this.users));

            // 從排行榜中刪除
            delete this.dailyLeaderboard[this.currentUser];
            localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));

            // 登出用戶
            this.logout();
            alert('帳戶已成功注銷');
        }
    }
}

// 遊戲邏輯
class Game {
    constructor(userSystem) {
        this.userSystem = userSystem;
        this.correctCount = 0;
        this.isAnimating = false;
        this.setupEventListeners();
        // 初始顯示排行榜
        this.displayLeaderboard();
    }

    setupEventListeners() {
        const headsButton = document.getElementById('guessHeads');
        const tailsButton = document.getElementById('guessTails');
        
        if (headsButton && tailsButton) {
            headsButton.addEventListener('click', () => this.handleGuess('數字'));
            tailsButton.addEventListener('click', () => this.handleGuess('圖案'));
        }
    }

    toggleButtons(disabled) {
        const headsButton = document.getElementById('guessHeads');
        const tailsButton = document.getElementById('guessTails');
        headsButton.disabled = disabled;
        tailsButton.disabled = disabled;
        headsButton.style.opacity = disabled ? '0.5' : '1';
        tailsButton.style.opacity = disabled ? '0.5' : '1';
    }

    tossCoin() {
        return Math.random() < 0.5 ? '數字' : '圖案';
    }

    calculateProbability(count) {
        return (1 / Math.pow(2, count)).toFixed(4);
    }

    updateResult(message) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = message;
        resultDiv.style.display = 'block';
    }

    handleGuess(guess) {
        if (this.isAnimating) return;

        const coin = document.getElementById('flipCoin');
        const result = this.tossCoin();
        
        this.isAnimating = true;
        this.toggleButtons(true);

        // 重置硬幣的初始狀態
        coin.style.transform = 'rotateY(0deg)';
        
        // 根據結果決定最終旋轉角度
        const finalRotation = result === '數字' ? 1800 : 1980; // 5圈或5.5圈
        
        // 設置自定義屬性來控制動畫
        coin.style.setProperty('--final-rotation', `${finalRotation}deg`);
        
        // 開始翻轉動畫
        requestAnimationFrame(() => {
            coin.classList.add('flipping');
        });

        // 3秒後（動畫結束時）顯示結果
        setTimeout(() => {
            coin.classList.remove('flipping');
            
            // 確保最終位置正確
            coin.style.transform = `rotateY(${result === '數字' ? 0 : 180}deg)`;

            if (result === guess) {
                this.correctCount++;
                const probability = this.calculateProbability(this.correctCount);
                this.updateResult(`你猜對了！結果是 ${result}。\n連續猜對次數：${this.correctCount}\n當前概率：${probability}`);
            } else {
                this.updateResult(`你猜錯了！結果是 ${result}。遊戲結束，重新開始。`);
                this.userSystem.saveScore(this.correctCount);
                this.correctCount = 0;
            }
            this.displayLeaderboard();
            
            this.isAnimating = false;
            this.toggleButtons(false);
        }, 3000);
    }

    displayLeaderboard() {
        const leaderboardDiv = document.getElementById('leaderboard');
        const dailyLeaderboard = this.userSystem.getDailyLeaderboard();
        const allTimeLeaderboard = this.userSystem.getAllTimeLeaderboard();
        
        let html = '<div class="leaderboards-container">';
        
        // 每日排行榜
        html += '<div class="leaderboard-section">';
        html += '<h2>今日排行榜</h2>';
        if (dailyLeaderboard.length > 0) {
            html += dailyLeaderboard.map((entry, index) => {
                const probability = entry.score > 0 ? this.calculateProbability(entry.score) : '0';
                return `<p>${index + 1}. ${entry.username}: ${entry.score} 次 (概率: ${probability})</p>`;
            }).join('');
        } else {
            html += '<p>今日還沒有記錄</p>';
        }
        html += '</div>';

        // 永久排行榜
        html += '<div class="leaderboard-section">';
        html += '<h2>永久排行榜</h2>';
        if (allTimeLeaderboard.length > 0) {
            html += allTimeLeaderboard.map((entry, index) => {
                const probability = entry.score > 0 ? this.calculateProbability(entry.score) : '0';
                return `<p>${index + 1}. ${entry.username}: ${entry.score} 次 (概率: ${probability})</p>`;
            }).join('');
        } else {
            html += '<p>還沒有記錄</p>';
        }
        html += '</div>';
        
        html += '</div>';
        
        leaderboardDiv.innerHTML = html;
        leaderboardDiv.style.display = 'block';
    }
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    window.userSystem = new UserSystem();
    window.game = new Game(window.userSystem);
});

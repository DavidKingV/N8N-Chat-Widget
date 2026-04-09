// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-bubble: var(--n8n-chat-bubble-color, var(--chat--color-primary));
            --chat--color-bubble-secondary: var(--n8n-chat-bubble-secondary-color, var(--chat--color-secondary));
            --chat--color-new-chat-btn: var(--n8n-chat-new-chat-btn-color, var(--chat--color-primary));
            --chat--color-new-chat-btn-secondary: var(--n8n-chat-new-chat-btn-secondary-color, var(--chat--color-secondary));
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            animation: n8n-badge-in 0.35s ease-out;
        }

        .n8n-chat-widget .chat-container.closing {
          animation: n8n-badge-out 0.25s ease-in forwards;
        }

        /* ─── Brand header ─── */
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 2.5em;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img.brand-logo {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        /* ─── Header menu (three dots) ─── */
        .n8n-chat-widget .header-menu-wrapper {
            position: absolute;
            right: 48px;
            top: 50%;
            transform: translateY(-50%);
        }

        .n8n-chat-widget .header-menu-btn {
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.6;
            transition: opacity 0.2s;
            font-size: 2em;
            line-height: 1;
            letter-spacing: 1px;
        }

        .n8n-chat-widget .header-menu-btn:hover {
            opacity: 1;
        }

        .n8n-chat-widget .header-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            min-width: 180px;
            z-index: 10;
            overflow: hidden;
        }

        .n8n-chat-widget .header-dropdown.open {
            display: block;
        }

        .n8n-chat-widget .header-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 10px 14px;
            background: none;
            border: none;
            color: var(--chat--color-font);
            font-size: 13px;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.15s;
            text-align: left;
        }

        .n8n-chat-widget .header-dropdown-item:hover {
            background: rgba(133, 79, 255, 0.08);
        }

        .n8n-chat-widget .header-dropdown-item svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* ─── Welcome screen ─── */
        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-new-chat-btn) 0%, var(--chat--color-new-chat-btn-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s, opacity 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        /* ─── Chat interface ─── */
        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* ─── Typing indicator ─── */
        .n8n-chat-widget .typing-indicator {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 4px;
            height: 40px;
        }

        .n8n-chat-widget .typing-indicator .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--chat--color-primary);
            opacity: 0.4;
            animation: n8n-typing-bounce 1.4s infinite ease-in-out both;
        }

        .n8n-chat-widget .typing-indicator .dot:nth-child(1) {
            animation-delay: 0s;
        }

        .n8n-chat-widget .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .n8n-chat-widget .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes n8n-typing-bounce {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.4;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* ─── Chat input ─── */
        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-input button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        /* ─── Bubble toggle ─── */
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-bubble) 0%, var(--chat--color-bubble-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 32px;
            height: 32px;
            fill: currentColor;
            flex-shrink: 0;
        }

        .n8n-chat-widget .chat-toggle img {
            width: 32px;
            height: 32px;
            object-fit: contain;
            flex-shrink: 0;
        }

        /* ─── Bubble notification badge ─── */
        .n8n-chat-widget .bubble-notification {
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 1000;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            padding: 10px 16px;
            border-radius: 12px 12px 0 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 1.12);
            font-size: 18px;
            line-height: 1.4;
            max-width: 220px;
            font-family: inherit;
            animation: n8n-badge-in 0.35s ease-out;
            cursor: pointer;
        }

        .n8n-chat-widget .bubble-notification.position-left {
            right: auto;
            left: 20px;
            border-radius: 12px 12px 12px 0;
        }

        .n8n-chat-widget .bubble-notification .badge-close {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--chat--color-font);
            color: var(--chat--color-background);
            border: none;
            font-size: 11px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
            padding: 0;
            opacity: 1;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .bubble-notification .badge-close:hover {
            opacity: 1;
        }

        @keyframes n8n-badge-in {
            from {
                opacity: 0;
                transform: translateY(8px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes n8n-badge-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
        }

        /* ─── Footer ─── */
        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
            .n8n-chat-widget .chat-toggle {
                width: 56px;
                height: 56px;
                border-radius: 28px;
                bottom: 16px;
                right: 16px;
            }

            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 16px;
            }

            .n8n-chat-widget .chat-toggle svg,
            .n8n-chat-widget .chat-toggle img {
                width: 28px;
                height: 28px;
            }

            .n8n-chat-widget .chat-container {
                width: calc(100vw - 16px);
                height: calc(100vh - 80px);
                bottom: 8px;
                right: 8px;
                left: 8px;
                border-radius: 12px;
            }

            .n8n-chat-widget .chat-container.position-left {
                right: 8px;
                left: 8px;
            }

            .n8n-chat-widget .bubble-notification {
                bottom: 76px;
                right: 16px;
                max-width: 200px;
            }

            .n8n-chat-widget .bubble-notification.position-left {
                right: auto;
                left: 16px;
            }
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default SVG icons
    const defaultBubbleIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>`;

    const defaultNewChatIcon = `<svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>`;

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by Mad',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        bubble: {
            icon: '',
            color: '',
            secondaryColor: '',
            notificationMessage: ''  // Optional text shown as a badge next to the bubble
        },
        newChatButton: {
            text: 'Send us a message',
            icon: '',
            color: '',
            secondaryColor: ''
        },
        i18n: {
            inputPlaceholder: 'Type your message here...',
            sendButton: 'Send',
            errorMessage: 'Sorry, something went wrong. Please try again.',
            endConversation: 'End conversation',
            greetingMessage: ''  // Bot greeting shown when a new chat starts (empty = disabled)
        },
        session: {
            persist: true
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            bubble: { ...defaultConfig.bubble, ...window.ChatWidgetConfig.bubble },
            newChatButton: { ...defaultConfig.newChatButton, ...window.ChatWidgetConfig.newChatButton },
            i18n: { ...defaultConfig.i18n, ...window.ChatWidgetConfig.i18n },
            session: { ...defaultConfig.session, ...window.ChatWidgetConfig.session }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let isSending = false;
    let chatMessages = [];
    let greetingShown = false; // tracks if the auto-greeting has been shown this session
    const SESSION_STORAGE_KEY = 'n8n_chat_session';

    // ─── Session persistence helpers ───
    function saveSession() {
        if (!config.session.persist) return;
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
                sessionId: currentSessionId,
                messages: chatMessages,
                greetingShown: greetingShown
            }));
        } catch (e) {}
    }

    function loadSession() {
        if (!config.session.persist) return null;
        try {
            const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (data && data.sessionId && Array.isArray(data.messages)) {
                return data;
            }
        } catch (e) {}
        return null;
    }

    function clearSession() {
        if (!config.session.persist) return;
        try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } catch (e) {}
    }

    // ─── Build DOM ───
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    widgetContainer.style.setProperty('--n8n-chat-bubble-color', config.bubble.color || config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-bubble-secondary-color', config.bubble.secondaryColor || config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-new-chat-btn-color', config.newChatButton.color || config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-new-chat-btn-secondary-color', config.newChatButton.secondaryColor || config.style.secondaryColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    const newChatButtonIcon = config.newChatButton.icon
        ? `<img class="message-icon" src="${config.newChatButton.icon}" alt="">`
        : defaultNewChatIcon;

    const newConversationHTML = `
        <div class="brand-header">
            <img class="brand-logo" src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">\u00d7</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                ${newChatButtonIcon}
                ${config.newChatButton.text}
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img class="brand-logo" src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <div class="header-menu-wrapper">
                    <button class="header-menu-btn" aria-label="Menu">\u22EE</button>
                    <div class="header-dropdown">
                        <button class="header-dropdown-item" data-action="end-conversation">
                            <svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke-width="1.5"/></svg>
                            ${config.i18n.endConversation}
                        </button>
                    </div>
                </div>
                <button class="close-button">\u00d7</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="${config.i18n.inputPlaceholder}" rows="1"></textarea>
                <button type="submit">${config.i18n.sendButton}</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

    // Toggle bubble
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    if (config.bubble.icon) {
        toggleButton.innerHTML = `<img src="${config.bubble.icon}" alt="Chat">`;
    } else {
        toggleButton.innerHTML = defaultBubbleIcon;
    }

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);

    // ─── Bubble notification badge ───
    let notificationBadge = null;
    if (config.bubble.notificationMessage) {
        notificationBadge = document.createElement('div');
        notificationBadge.className = `bubble-notification${config.style.position === 'left' ? ' position-left' : ''}`;
        notificationBadge.innerHTML = `
            <button class="badge-close">\u00d7</button>
            ${config.bubble.notificationMessage}
        `;
        widgetContainer.appendChild(notificationBadge);

        // Close badge
        notificationBadge.querySelector('.badge-close').addEventListener('click', (e) => {
            e.stopPropagation();
            notificationBadge.remove();
            notificationBadge = null;
        });

        // Click badge → open chat
        notificationBadge.addEventListener('click', () => {
            chatContainer.classList.add('open');
            notificationBadge.remove();
            notificationBadge = null;
        });
    }

    document.body.appendChild(widgetContainer);

    // ─── References ───
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const menuBtn = chatContainer.querySelector('.header-menu-btn');
    const dropdown = chatContainer.querySelector('.header-dropdown');
    const endConversationBtn = chatContainer.querySelector('[data-action="end-conversation"]');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // ─── Typing indicator ───
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    // ─── Render message ───
    function renderMessage(role, text) {
        const div = document.createElement('div');
        div.className = `chat-message ${role}`;
        div.textContent = text;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ─── Show greeting (simulated bot message on new chat) ───
    function showGreetingIfNeeded() {
        if (greetingShown || !config.i18n.greetingMessage) return;
        greetingShown = true;
        renderMessage('bot', config.i18n.greetingMessage);
        chatMessages.push({ role: 'bot', text: config.i18n.greetingMessage });
        saveSession();
    }

    // ─── Show/hide chat UI ───
    function showChatUI() {
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
    }

    function openChatInterface() {
        currentSessionId = generateUUID();
        chatMessages = [];
        greetingShown = false;
        saveSession();
        showChatUI();
        showGreetingIfNeeded();
        textarea.focus();
    }

    function restoreSession(sessionData) {
        currentSessionId = sessionData.sessionId;
        chatMessages = sessionData.messages;
        greetingShown = sessionData.greetingShown || false;
        showChatUI();
        chatMessages.forEach(function(msg) {
            renderMessage(msg.role, msg.text);
        });
    }

    function resetToWelcomeScreen() {
        // Clear state
        currentSessionId = '';
        chatMessages = [];
        greetingShown = false;
        clearSession();

        // Clear DOM
        messagesContainer.innerHTML = '';
        chatInterface.classList.remove('active');
        dropdown.classList.remove('open');

        // Show welcome screen again
        const headers = chatContainer.querySelectorAll('.brand-header');
        headers.forEach(h => h.style.display = '');
        chatContainer.querySelector('.new-conversation').style.display = '';
    }

    // ─── Send message ───
    async function sendMessage(message) {
        if (isSending) return;
        isSending = true;

        sendButton.disabled = true;
        textarea.disabled = true;

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        renderMessage('user', message);
        chatMessages.push({ role: 'user', text: message });
        saveSession();

        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();
            removeTypingIndicator(typingIndicator);

            const botText = Array.isArray(data) ? data[0].output : data.output;
            renderMessage('bot', botText);
            chatMessages.push({ role: 'bot', text: botText });
            saveSession();
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator(typingIndicator);
            renderMessage('bot', config.i18n.errorMessage);
        } finally {
            isSending = false;
            sendButton.disabled = false;
            textarea.disabled = false;
            textarea.focus();
        }
    }

    // ─── Restore existing session on page load ───
    const existingSession = loadSession();
    if (existingSession && existingSession.messages.length > 0) {
        restoreSession(existingSession);
    }

    // ─── Event listeners ───

    // Welcome screen → open chat
    newChatBtn.addEventListener('click', openChatInterface);

    // Send button
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });

    // Enter to send
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });

    // Toggle bubble
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        // Hide notification badge when chat opens
        if (notificationBadge && chatContainer.classList.contains('open')) {
            notificationBadge.remove();
            notificationBadge = null;
        }
    });

    // Close buttons
    chatContainer.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
            chatContainer.classList.toggle('close');
        });
    });

    // ─── Header menu ───
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
    });

    // End conversation
    endConversationBtn.addEventListener('click', () => {
        resetToWelcomeScreen();
    });
})();

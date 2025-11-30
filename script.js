const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const yearEl = document.getElementById('year');
const uploadInput = document.getElementById('reference-upload');
const uploadPreview = document.getElementById('upload-preview');
const form = document.getElementById('consultation-form');
const formStatus = document.getElementById('form-status');
const commentForm = document.getElementById('comment-form');
const commentStatus = document.getElementById('comment-status');
const commentList = document.getElementById('comment-list');
const commentName = document.getElementById('comment-name');
const commentContact = document.getElementById('comment-contact');
const commentMessage = document.getElementById('comment-message');
const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatClose = document.getElementById('chat-close');

const appointmentState = {
    intent: null,
    step: 'idle',
    payload: {},
};

let chatBootstrapped = false;
const NOTIFY_ENDPOINT = 'http://localhost:3000/api/notify';

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.textContent = isOpen ? 'Close' : 'Menu';
    });
}

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

if (uploadInput && uploadPreview) {
    uploadInput.addEventListener('change', () => {
        uploadPreview.innerHTML = '';
        const files = Array.from(uploadInput.files || []).slice(0, 5);

        if (files.length === 0) {
            return;
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const caption = document.createElement('figcaption');

                img.src = event.target?.result || '';
                img.alt = file.name;
                caption.textContent = file.name.length > 18 ? `${file.name.slice(0, 15)}...` : file.name;

                figure.append(img, caption);
                uploadPreview.appendChild(figure);
            };
            reader.readAsDataURL(file);
        });
    });
}

if (form && formStatus && uploadPreview) {
    form.addEventListener('submit', event => {
        event.preventDefault();

        formStatus.textContent = 'Sending...';
        formStatus.style.color = '#c7c7c7';

        setTimeout(() => {
            form.reset();
            uploadPreview.innerHTML = '';
            formStatus.textContent = 'Thank you! Our studio coordinator will reach out shortly.';
            formStatus.style.color = '#7bed9f';
        }, 900);
    });
}

if (commentForm && commentStatus && commentList && commentName && commentMessage) {
    commentForm.addEventListener('submit', event => {
        event.preventDefault();

        const nameValue = commentName.value.trim();
        const contactValue = (commentContact && commentContact.value.trim()) || '';
        const messageValue = commentMessage.value.trim();

        if (!nameValue || !messageValue) {
            commentStatus.textContent = 'Please share your name and a short message before posting.';
            commentStatus.style.color = '#ffb347';
            return;
        }

        const entry = document.createElement('li');
        const article = document.createElement('article');
        const header = document.createElement('header');
        const nameHeading = document.createElement('h4');
        const timeStamp = document.createElement('time');
        const body = document.createElement('p');

        const now = new Date();
        timeStamp.dateTime = now.toISOString();
        timeStamp.textContent = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        nameHeading.textContent = contactValue ? `${nameValue} (${contactValue})` : nameValue;
        body.textContent = messageValue;

        header.append(nameHeading, timeStamp);
        article.append(header, body);
        entry.appendChild(article);
        commentList.prepend(entry);

        commentForm.reset();
        commentStatus.textContent = 'Thanks for sharing! We will follow up if you left contact details.';
        commentStatus.style.color = '#7bed9f';
    });
}

function addChatMessage(author, text) {
    if (!chatLog) {
        return;
    }

    const li = document.createElement('li');
    li.className = `chatbot__message chatbot__message--${author}`;

    const bubble = document.createElement('span');
    bubble.textContent = text;

    li.appendChild(bubble);
    chatLog.appendChild(li);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function sendNotification(intent, payload) {
    const notice = {
        intent,
        payload,
        timestamp: new Date().toISOString(),
    };

    console.log('Notify artist:', notice);

    if (!NOTIFY_ENDPOINT) {
        return;
    }

    fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notice),
    }).catch(error => {
        console.error('Notification error', error);
    });
}

function resetAppointmentState() {
    appointmentState.intent = null;
    appointmentState.step = 'idle';
    appointmentState.payload = {};
}

function summarizeAppointment(intent) {
    const { name, date, time, contact } = appointmentState.payload;
    const summary = `Got it. ${intent === 'cancel' ? 'We will cancel' : intent === 'change' ? 'We will update' : 'We will book'} the session for ${name || 'you'} on ${date || 'the requested date'} at ${time || 'the requested time'}.`;
    const followUp = contact ? ` We'll confirm at ${contact}.` : ' We will follow up via the contact information we have on file.';
    addChatMessage('assistant', summary + followUp);
    sendNotification(intent, { ...appointmentState.payload });
    resetAppointmentState();
}

function processAppointmentFlow(text) {
    if (appointmentState.intent === 'cancel') {
        switch (appointmentState.step) {
            case 'cancel-name':
                appointmentState.payload.name = text;
                appointmentState.step = 'cancel-date';
                addChatMessage('assistant', 'Thanks. What date was the appointment scheduled for?');
                break;
            case 'cancel-date':
                appointmentState.payload.date = text;
                appointmentState.step = 'cancel-reason';
                addChatMessage('assistant', 'Any notes you want us to know? (Optional)');
                break;
            case 'cancel-reason':
                appointmentState.payload.notes = text;
                summarizeAppointment('cancel');
                break;
            default:
                resetAppointmentState();
                addChatMessage('assistant', "Let's start over. How can I help with your booking?");
                break;
        }
        return;
    }

    switch (appointmentState.step) {
        case 'collect-name':
            appointmentState.payload.name = text;
            appointmentState.step = 'collect-date';
            addChatMessage('assistant', 'Perfect. What date are you aiming for?');
            break;
        case 'collect-date':
            appointmentState.payload.date = text;
            appointmentState.step = 'collect-time';
            addChatMessage('assistant', 'And what time works best?');
            break;
        case 'collect-time':
            appointmentState.payload.time = text;
            appointmentState.step = 'collect-contact';
            addChatMessage('assistant', 'Last thing—where should we send confirmations? (Phone or email)');
            break;
        case 'collect-contact':
            appointmentState.payload.contact = text;
            summarizeAppointment(appointmentState.intent || 'schedule');
            break;
        default:
            resetAppointmentState();
            addChatMessage('assistant', "Let's start fresh. Do you need to book, change, or cancel a session?");
            break;
    }
}

function startAppointmentFlow(intent) {
    appointmentState.intent = intent;
    appointmentState.payload = {};

    if (intent === 'cancel') {
        appointmentState.step = 'cancel-name';
        addChatMessage('assistant', 'No problem. Can you share the name the appointment is under?');
        return;
    }

    appointmentState.step = 'collect-name';
    const intro = intent === 'change'
        ? 'Let’s get your new slot locked in. What name is the appointment under?'
        : 'Awesome! Let’s get you on the books. What name should we put on the appointment?';
    addChatMessage('assistant', intro);
}

function handleChatSubmission(event) {
    event.preventDefault();
    if (!chatInput) {
        return;
    }

    const text = chatInput.value.trim();
    if (!text) {
        return;
    }

    addChatMessage('user', text);
    chatInput.value = '';

    const normalized = text.toLowerCase();

    if (appointmentState.step !== 'idle') {
        processAppointmentFlow(text);
        return;
    }

    if (normalized.includes('book') || normalized.includes('schedule')) {
        startAppointmentFlow('schedule');
        return;
    }

    if (normalized.includes('change') || normalized.includes('reschedule')) {
        startAppointmentFlow('change');
        return;
    }

    if (normalized.includes('cancel')) {
        startAppointmentFlow('cancel');
        return;
    }

    if (['thanks', 'thank you', 'appreciate it'].some(phrase => normalized.includes(phrase))) {
        addChatMessage('assistant', "Any time! If you need anything else, just type it in.");
        return;
    }

    addChatMessage('assistant', "I'm here to help with bookings. You can say things like ‘Book a session for Friday at 4pm’. For anything else, text or call the studio at (555) 555-1234.");
}

function openChat() {
    if (!chatPanel || !chatToggle) {
        return;
    }

    chatPanel.hidden = false;
    chatToggle.setAttribute('aria-expanded', 'true');
    chatInput?.focus();

    if (!chatBootstrapped) {
        addChatMessage('assistant', 'Hey there! I can help book, reschedule, or cancel your session. What would you like to do?');
        chatBootstrapped = true;
    }
}

function closeChat() {
    console.log('closeChat called', { chatPanel, chatToggle });
    if (!chatPanel || !chatToggle) {
        console.log('Missing elements in closeChat');
        return;
    }
    console.log('Setting panel to hidden');
    chatPanel.hidden = true;
    chatToggle.setAttribute('aria-expanded', 'false');
    console.log('Panel hidden:', chatPanel.hidden);
}

if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
        const isHidden = chatPanel.hidden;
        if (isHidden) {
            openChat();
        } else {
            closeChat();
        }
    });
}

if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmission);
}

// Add close button handler
if (chatClose) {
    console.log('Close button found:', chatClose);
    chatClose.addEventListener('click', (e) => {
        console.log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        closeChat();
    });
} else {
    console.log('Close button NOT found');
}

if (chatPanel && !chatPanel.hidden) {
    openChat();
}

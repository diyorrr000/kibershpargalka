document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const searchInput = document.getElementById('searchInput');
    const totalCountSpan = document.getElementById('total-count');
    const loader = document.getElementById('loader');

    // Simulate loading delay for effect
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Initial Render
    renderQuestions(qaData);

    // Search Event Listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const tokens = searchTerm.split(/\s+/).filter(token => token.length > 0);

        const filteredData = qaData.filter(item => {
            const questionText = item.question.toLowerCase();
            const idText = item.id.toString();

            if (tokens.length === 0) return true;

            // Check if ALL tokens are present in either question OR id
            // This allows "word1 word2" to match if both are somewhere in the content
            return tokens.every(token =>
                questionText.includes(token) ||
                idText.includes(token)
            );
        });

        // Auto-expand if few results
        const paramForRender = {
            data: filteredData,
            autoExpand: filteredData.length <= 5 && searchTerm.length > 0
        };

        renderQuestions(filteredData, filteredData.length <= 5 && searchTerm.length > 0);
    });

    function renderQuestions(data, autoExpand = false) {
        container.innerHTML = '';
        totalCountSpan.textContent = data.length;

        if (data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 20px; color: #888;">Hech narsa topilmadi.</div>';
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            if (autoExpand) {
                card.classList.add('active');
            }

            // Add staggered animation delay
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
            card.style.opacity = '0'; // Start hidden for animation

            const header = document.createElement('div');
            header.className = 'card-header';
            header.innerHTML = `
                <span class="question-number">#${item.id}</span>
                <span class="question-text">${item.question}</span>
                <i class="fa-solid fa-chevron-down toggle-icon"></i>
            `;

            const body = document.createElement('div');
            body.className = 'card-body';
            body.innerHTML = `
                <div class="answer-content">
                    ${item.answer}
                </div>
            `;

            // Toggle Logic
            header.addEventListener('click', () => {
                const isActive = card.classList.contains('active');

                // If not auto-expanded (or even if it is), we might want accordion behavior.
                // But user asked for "convenience". Usually accordion closes others. 
                // Let's keep the "close all others" behavior for manual clicks 
                // to maintain cleanliness, unless the user specifically filtered them.
                // However, if we preserve the "close others" behavior, clicking one in a list of 
                // auto-expanded items might close all others, which is fine.

                // Close all others
                document.querySelectorAll('.card.active').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('active');
                    }
                });

                // Toggle current
                card.classList.toggle('active');
            });

            card.appendChild(header);
            card.appendChild(body);
            container.appendChild(card);
        });
    }

    // Add global keyframes for fade in if not present in CSS (adding here for safety)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);
});

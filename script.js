/* ==========================================================================
   10 MONTHS WITH YOU - INTERACTIVE ARCHIVE SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. STATE & STORAGE MANAGEMENT
    // ----------------------------------------------------------------------
    const STORAGE_KEY = 'mahen_shayla_10m_progress';

    let state = {
        discoveredRooms: [], // ['album', 'player', 'game', 'letters', 'archive', 'final']
        tomatoesFound: [],   // [0, 1, 2, 3, 4, 5]
        secretUnlocked: false
    };

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                state = JSON.parse(saved);
            } catch(e) {
                console.error("Failed to parse saved state");
            }
        }
        updateCountersUI();
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateCountersUI();
    }

    function markRoomDiscovered(roomName) {
        if (!state.discoveredRooms.includes(roomName)) {
            state.discoveredRooms.push(roomName);
            showToast(`${roomName.toUpperCase()} DISCOVERED ✓`);
            saveState();
        }
    }

    function updateCountersUI() {
        // Rooms count
        const roomCountEl = document.getElementById('rooms-discovered-count');
        if (roomCountEl) roomCountEl.textContent = state.discoveredRooms.length;

        // Tomatoes count
        const tomatoCountEl = document.getElementById('tomatoes-found-count');
        if (tomatoCountEl) tomatoCountEl.textContent = state.tomatoesFound.length;

        // Update card badges
        ['album', 'player', 'game', 'letters', 'archive'].forEach(r => {
            const badge = document.getElementById(`badge-${r}`);
            if (badge) {
                if (state.discoveredRooms.includes(r)) {
                    badge.textContent = 'DISCOVERED ✓';
                    badge.style.background = '#22c55e';
                    badge.style.color = '#fff';
                } else {
                    badge.textContent = 'UNEXPLORED';
                }
            }
        });

        // Final Room Logic
        const finalCard = document.getElementById('card-final-room');
        const finalBadge = document.getElementById('badge-final');
        const finalSub = document.getElementById('final-card-sub');

        if (state.discoveredRooms.length >= 5) {
            if (state.tomatoesFound.length >= 5 || state.secretUnlocked) {
                state.secretUnlocked = true;
                if (finalBadge) {
                    finalBadge.textContent = 'UNLOCKED 🔓';
                    finalBadge.style.background = '#eab308';
                }
                if (finalSub) finalSub.textContent = 'SECRET UNLOCKED';
            } else {
                if (finalBadge) finalBadge.textContent = 'ALMOST';
                if (finalSub) finalSub.textContent = `FIND 5 TOMATOES (${state.tomatoesFound.length}/5)`;
            }
        }
    }

    function showToast(msg) {
        const toast = document.getElementById('notification-toast');
        const toastMsg = document.getElementById('toast-message');
        if (toast && toastMsg) {
            toastMsg.textContent = msg;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2500);
        }
    }

    // ----------------------------------------------------------------------
    // 2. NAVIGATION & SCREEN SWITCHING
    // ----------------------------------------------------------------------
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });

        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
    }

    // Landing enter button
    document.getElementById('btn-enter').addEventListener('click', () => {
        showScreen('screen-hub');
    });

    // Hub Cards Click
    document.querySelectorAll('.card-y2k').forEach(card => {
        card.addEventListener('click', () => {
            const room = card.getAttribute('data-room');
            if (room === 'final') {
                if (state.discoveredRooms.length < 5) {
                    showToast("Explore all 5 rooms first!");
                    return;
                }
                if (!state.secretUnlocked && state.tomatoesFound.length < 5) {
                    showToast("Find all 5 hidden tomatoes to unlock!");
                    return;
                }
                showScreen('room-final');
                markRoomDiscovered('final');
            } else {
                showScreen(`room-${room}`);
                markRoomDiscovered(room);
            }
        });
    });

    // Back to Menu Buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('screen-hub');
        });
    });

    // ----------------------------------------------------------------------
    // 3. TOMATO HUNT SYSTEM
    // ----------------------------------------------------------------------
    document.querySelectorAll('.hidden-tomato').forEach(tom => {
        tom.addEventListener('click', (e) => {
            e.stopPropagation();
            const tomId = parseInt(tom.getAttribute('data-tomato-id'));

            if (tomId === 0) {
                showToast("that's just a tomato. 🍅");
                return;
            }

            if (!state.tomatoesFound.includes(tomId)) {
                state.tomatoesFound.push(tomId);
                saveState();
                showToast(`TOMATO FOUND! 🍅 (${state.tomatoesFound.length}/5)`);
                tom.style.transform = 'scale(1.5) rotate(20deg)';
                setTimeout(() => { tom.style.display = 'none'; }, 300);
            } else {
                showToast("Already collected this tomato!");
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. ROOM 01: THE ALBUM (PHOTOS)
    // ----------------------------------------------------------------------
    const albumData = [
        { img: 'assets/photos/photo_01.jpg', title: 'THE TREE INCIDENT', caption: 'she was looking everywhere. i was literally above her.' },
        { img: 'assets/photos/photo_02.jpg', title: 'RANDOM SNAP', caption: '10/10 moment. 0/10 behavior.' },
        { img: 'assets/chat/chat_01.jpg', title: 'PRESET ERA', caption: 'where it all began on 11 April 2025.' },
        { img: 'assets/roblox/roblox_tree.jpg', title: 'MUKBANG MAP', caption: 'bro really lost me on a Roblox tree.' },
        { img: 'assets/photos/photo_03.jpg', title: 'STUPID MOMENT #42', caption: 'why did we do this' }
    ];

    let currentPhotoIdx = 0;

    function renderAlbum() {
        const grid = document.getElementById('album-grid');
        if (!grid) return;
        grid.innerHTML = '';

        albumData.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.style.setProperty('--rand', Math.random());
            card.innerHTML = `
                <div class="polaroid-img-box">
                    <img src="${item.img}" onerror="this.onerror=null; this.src='https://via.placeholder.com/200x150/cbd5e1/334155?text=PHOTO+${idx+1}';" alt="${item.title}">
                </div>
                <div class="polaroid-caption">${item.title}</div>
            `;
            card.addEventListener('click', () => openPhotoModal(idx));
            grid.appendChild(card);
        });
    }

    function openPhotoModal(idx) {
        currentPhotoIdx = idx;
        const item = albumData[idx];
        const modal = document.getElementById('photo-modal');
        const img = document.getElementById('modal-img');
        const title = document.getElementById('modal-title');
        const caption = document.getElementById('modal-caption');

        img.src = item.img;
        img.onerror = function() {
            this.src = `https://via.placeholder.com/400x300/cbd5e1/334155?text=PHOTO+${idx+1}`;
        };
        title.textContent = item.title;
        caption.textContent = item.caption;

        modal.classList.remove('hidden');
    }

    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('photo-modal').classList.add('hidden');
    });

    document.getElementById('modal-prev').addEventListener('click', () => {
        currentPhotoIdx = (currentPhotoIdx - 1 + albumData.length) % albumData.length;
        openPhotoModal(currentPhotoIdx);
    });

    document.getElementById('modal-next').addEventListener('click', () => {
        currentPhotoIdx = (currentPhotoIdx + 1) % albumData.length;
        openPhotoModal(currentPhotoIdx);
    });

    // ----------------------------------------------------------------------
    // 5. ROOM 02: THE PLAYER (MUSIC)
    // ----------------------------------------------------------------------
    const playlistData = [
        { title: 'Kita Lewati Berdua', artist: 'Main Song' },
        { title: 'Film Favorite', artist: 'Playlist Track' },
        { title: 'Best Part', artist: 'Daniel Caesar' },
        { title: 'Shape of My Heart', artist: 'Classic' },
        { title: 'Aku Rindu', artist: 'Playlist Track' }
    ];

    let isPlaying = false;
    let currentTrackIdx = 0;

    function renderPlaylist() {
        const listEl = document.getElementById('playlist');
        if (!listEl) return;
        listEl.innerHTML = '';

        playlistData.forEach((track, idx) => {
            const li = document.createElement('li');
            li.className = idx === currentTrackIdx ? 'active' : '';
            li.textContent = `${idx + 1}. ${track.title} - ${track.artist}`;
            li.addEventListener('click', () => selectTrack(idx));
            listEl.appendChild(li);
        });
    }

    function selectTrack(idx) {
        currentTrackIdx = idx;
        const track = playlistData[idx];
        document.getElementById('current-song-title').textContent = track.title;
        document.getElementById('current-artist').textContent = track.artist;
        renderPlaylist();
        togglePlay(true);
    }

    function togglePlay(forceState) {
        isPlaying = forceState !== undefined ? forceState : !isPlaying;
        const cd = document.getElementById('cd-disc');
        const eq = document.querySelector('.equalizer');

        if (isPlaying) {
            cd.classList.add('spinning');
            eq.classList.add('playing');
        } else {
            cd.classList.remove('spinning');
            eq.classList.remove('playing');
        }
    }

    document.getElementById('cd-disc').addEventListener('click', () => togglePlay());

    // ----------------------------------------------------------------------
    // 6. ROOM 03: THE GAME
    // ----------------------------------------------------------------------
    let currentGameLevel = 1;

    function renderGameLevel(lvl) {
        currentGameLevel = lvl;
        const stage = document.getElementById('game-stage');
        const indicator = document.getElementById('game-level-indicator');
        const title = document.getElementById('game-level-title');

        indicator.textContent = `LEVEL 0${lvl} / 05`;
        stage.innerHTML = '';

        if (lvl === 1) {
            title.textContent = 'LEVEL 01 — FIND THE TOMATO';
            stage.innerHTML = `
                <p style="font-family:var(--font-mono); font-size:0.8rem; margin-bottom:10px;">Tap the tomato hidden in this scene!</p>
                <div style="position:relative; width:280px; height:120px; background:#e2e8f0; border:2px solid #1a1a1a; border-radius:8px;">
                    <span style="position:absolute; top:10px; left:20px; font-size:1.5rem;">🌸</span>
                    <span style="position:absolute; bottom:15px; right:40px; font-size:1.5rem;">🧸</span>
                    <div id="game-lvl1-tomato" style="position:absolute; top:40px; left:120px; font-size:1.4rem; cursor:pointer;">🍅</div>
                </div>
            `;
            document.getElementById('game-lvl1-tomato').addEventListener('click', () => {
                showToast("correct. 🍅");
                // Collect Tomato #3 in Game Room
                if (!state.tomatoesFound.includes(3)) {
                    state.tomatoesFound.push(3);
                    saveState();
                }
                setTimeout(() => renderGameLevel(2), 1000);
            });
        } 
        else if (lvl === 2) {
            title.textContent = "LEVEL 02 — WHERE'S MAHEN?";
            stage.innerHTML = `
                <p style="font-family:var(--font-handwriting); font-size:1.1rem; margin-bottom:5px;">"SHE WAS LOOKING FOR ME. I WAS LITERALLY RIGHT THERE."</p>
                <div class="roblox-scene">
                    <img src="assets/roblox/roblox_tree.jpg" onerror="this.onerror=null; this.src='https://via.placeholder.com/380x160/78350f/fef08a?text=BROWN+ROBLOX+TREE';" alt="Roblox Tree Scene">
                    <div id="mahen-target" class="mahen-hidden-target" title="Tap Mahen"></div>
                </div>
            `;
            document.getElementById('mahen-target').addEventListener('click', () => {
                showToast("HOW DID YOU MISS ME 😭");
                setTimeout(() => renderGameLevel(3), 1200);
            });
        }
        else if (lvl === 3) {
            title.textContent = 'LEVEL 03 — WHAT WERE WE?';
            stage.innerHTML = `
                <p style="font-family:var(--font-mono); font-size:0.85rem; margin-bottom:10px;">before there was "bebey", there was...</p>
                <div class="game-opts-grid">
                    <button class="btn-opt" data-ans="wrong">strangers</button>
                    <button class="btn-opt" data-ans="wrong">enemies</button>
                    <button class="btn-opt" data-ans="correct">besties</button>
                    <button class="btn-opt" data-ans="wrong">coworkers</button>
                </div>
            `;
            stage.querySelectorAll('.btn-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.getAttribute('data-ans') === 'correct') {
                        showToast("before there was bebey, there was bestie.");
                        setTimeout(() => renderGameLevel(4), 1200);
                    } else {
                        showToast("nope, try again!");
                    }
                });
            });
        }
        else if (lvl === 4) {
            title.textContent = 'LEVEL 04 — WHO SAID IT?';
            stage.innerHTML = `
                <div style="background:#f8fafc; border:2px solid #1a1a1a; padding:10px; border-radius:8px; margin-bottom:10px; font-family:var(--font-mono); font-size:0.8rem;">
                    "mau buka lembaran baru bareng gua?"
                </div>
                <div class="game-opts-grid">
                    <button class="btn-opt" data-speaker="MAHEN">MAHEN</button>
                    <button class="btn-opt" data-speaker="SHAYLA">SHAYLA</button>
                </div>
            `;
            stage.querySelectorAll('.btn-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    showToast("Spot on!");
                    setTimeout(() => renderGameLevel(5), 1000);
                });
            });
        }
        else if (lvl === 5) {
            title.textContent = 'LEVEL 05 — FINAL QUESTION';
            stage.innerHTML = `
                <p style="font-family:var(--font-mono); font-size:0.85rem; margin-bottom:10px;">WHAT ARE WE?</p>
                <div class="game-opts-grid">
                    <button class="btn-opt" data-ans="wrong">Normal couple</button>
                    <button class="btn-opt" data-ans="wrong">Two functioning adults</button>
                    <button class="btn-opt" data-ans="correct">Best friends with relationship DLC</button>
                    <button class="btn-opt" data-ans="wrong">Completely normal people</button>
                </div>
            `;
            stage.querySelectorAll('.btn-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.getAttribute('data-ans') === 'correct') {
                        showToast("finally, you get it. GAME CLEARED ✓");
                        markRoomDiscovered('game');
                    } else {
                        showToast("wrong answer, be serious 😭");
                    }
                });
            });
        }
    }

    // ----------------------------------------------------------------------
    // 7. ROOM 04: THE LETTERS
    // ----------------------------------------------------------------------
    const lettersData = [
        { id: '01', tag: 'OPEN WHEN... MISS ME', text: "kalau lagi kangen, inget aja gua juga pasti lagi mikirin lu. don't be shy to text me first, okay?" },
        { id: '02', tag: 'OPEN WHEN... BAD DAY', text: "take a deep breath. bad days happen, but you don't have to go through them alone anymore. I'm right here." },
        { id: '03', tag: 'OPEN WHEN... NEED A LAUGH', text: "remember when I hid in that brown Roblox tree while you spent 10 minutes searching? 10/10 stealth move." },
        { id: '04', tag: 'OPEN WHEN... JUST WANNA HEAR FROM ME', text: "nothing crazy to say, just wanted to remind you that choosing you was the best decision I ever made." }
    ];

    function renderLetters() {
        const grid = document.getElementById('envelopes-grid');
        if (!grid) return;
        grid.innerHTML = '';

        lettersData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'envelope-card';
            card.innerHTML = `
                <div class="env-icon">💌</div>
                <div class="env-tag">${item.tag}</div>
                <h4>LETTER #${item.id}</h4>
            `;
            card.addEventListener('click', () => openLetterPrompt(item));
            grid.appendChild(card);
        });
    }

    function openLetterPrompt(item) {
        if (confirm("OPEN THIS?\nClick OK for [ YES ] or Cancel for [ obviously ]")) {
            showLetterModal(item);
        } else {
            showToast("yeah. thought so.");
            setTimeout(() => showLetterModal(item), 600);
        }
    }

    function showLetterModal(item) {
        document.getElementById('letter-modal-tag').textContent = item.tag;
        document.getElementById('letter-modal-text').textContent = item.text;
        document.getElementById('letter-modal').classList.remove('hidden');
    }

    document.getElementById('letter-modal-close').addEventListener('click', () => {
        document.getElementById('letter-modal').classList.add('hidden');
    });

    // ----------------------------------------------------------------------
    // 8. ROOM 05: THE ARCHIVE (10 CHAPTERS)
    // ----------------------------------------------------------------------
    const chaptersData = [
        { id: '01', title: 'THE PRESET INCIDENT', date: '11 APRIL 2025', body: 'It started with a preset. Kami pertama kali bertemu online karena Shayla membutuhkan bantuan memasang preset.' },
        { id: '02', title: 'THE RECHAT ERA', date: 'MID 2025', body: 'Apparently, letting a conversation drown wasn\'t an option. Shayla sering menghidupkan kembali percakapan ketika Mahen malas.' },
        { id: '03', title: 'THE FIRST ALMOST', date: '2025', body: '“mau buka lembaran baru bareng gua?”' },
        { id: '04', title: 'THE DISAPPEARING ERA', date: '2025', body: 'Mahen disappeared. Classic. Mahen pergi dari Tele selama beberapa bulan.' },
        { id: '05', title: 'WHY WERE YOU STILL THERE?', date: 'LATE 2025', body: 'Months later, somehow... you were still there. Mahen kembali dan melihat Shayla masih berada di channel-nya.' },
        { id: '06', title: 'THE RECHAT I NEVER GOT', date: 'LATE 2025', body: 'Turns out, you wanted to talk too. Shayla sebenarnya ingin menghubungi lagi tetapi malu karena akun Mahen sudah tidak aktif.' },
        { id: '07', title: 'BEFORE THERE WAS BEBEY', date: '2025', body: 'Before there was bebey, there was bestie.' },
        { id: '08', title: 'THE CONFESSION', date: '19 NOVEMBER 2025', body: 'Romantic confession. Terrible venue. 0/10 location. 10/10 outcome. Mahen menyatakan perasaan dan Shayla menerima.' },
        { id: '09', title: 'WE LEARNED', date: 'EARLY 2026', body: 'We almost lost what we had. So we learned how to understand each other.' },
        { id: '10', title: 'STILL HERE', date: '19 SEPTEMBER 2026', body: 'Still talking. Still laughing. Still annoying each other. Still us.' }
    ];

    function renderArchiveSidebar() {
        const list = document.getElementById('chapter-list');
        if (!list) return;
        list.innerHTML = '';

        chaptersData.forEach((ch, idx) => {
            const li = document.createElement('li');
            li.textContent = `${ch.id}. ${ch.title}`;
            li.addEventListener('click', () => selectChapter(idx));
            list.appendChild(li);
        });

        selectChapter(0);
    }

    function selectChapter(idx) {
        const ch = chaptersData[idx];
        const listItems = document.querySelectorAll('#chapter-list li');
        listItems.forEach((li, i) => li.classList.toggle('active', i === idx));

        document.getElementById('archive-file-title').textContent = `chapter_${ch.id}.txt`;
        const contentArea = document.getElementById('archive-content-area');
        contentArea.innerHTML = `
            <h3>${ch.title}</h3>
            <div class="archive-date">${ch.date}</div>
            <div class="archive-body">${ch.body}</div>
        `;
    }

    // ----------------------------------------------------------------------
    // 9. INITIALIZATION
    // ----------------------------------------------------------------------
    loadState();
    renderAlbum();
    renderPlaylist();
    renderGameLevel(1);
    renderLetters();
    renderArchiveSidebar();

});

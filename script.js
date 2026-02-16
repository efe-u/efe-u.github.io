// =============================================================
// DATA
// =============================================================

const projects = {
    'handsin': {
        desc: 'Sign-language conversational AI system — HackTech 2025 @ Caltech',
        link: 'https://github.com/efe-u'
    },
    'r19q-mutation': {
        desc: 'Molecular dynamics simulation analyzing SBDS protein mutation',
        link: 'https://github.com/efe-u'
    },
    'tennis-motion-ai': {
        desc: 'AI-driven motion analysis system for tennis @ TU Dortmund',
        link: 'https://github.com/efe-u'
    }
};

const links = {
    github: 'https://github.com/efe-u',
    linkedin: 'https://www.linkedin.com/in/nusret-efe-ucer-868296243/'
};

const experiences = [
    {
        company: 'G LNK (YC W25)',
        role: 'ML Engineer (Part-Time) / ML Engineering Intern',
        date: 'June 2025 – Present',
        details: [
            'Built company database from zero — unified 300+ gov healthcare datasets',
            'Transformed 10\u2079+ raw records into 10\u2077-scale Elasticsearch/Databricks/MongoDB',
            'Engineered client-facing ETL pipeline — scaled to ~92% global market coverage',
            'Built full-stack search & analytics system with multi-criteria filtering'
        ]
    },
    {
        company: 'UChicago PULSE-A',
        role: 'Ground Station Software Engineer',
        date: 'October 2024 – Present',
        details: [
            'Built PyQt Ground Station control system from scratch',
            'Integrated GUI, backend logic, multithreaded process management',
            'Designed latency-aware protocols for satellite communication'
        ]
    },
    {
        company: 'Technische Universit\u00e4t Dortmund',
        role: 'Research Assistant',
        date: 'July 2023 – September 2023',
        details: [
            'Developed AI-driven motion-analysis system for tennis',
            'Built error-analysis pipeline with custom weighted metric',
            'Invited to present work at TU Dortmund'
        ]
    },
    {
        company: 'UChicago ACM',
        role: 'AI/ML Committee Co-director',
        date: 'October 2024 – Present',
        details: [
            'Led AI/ML committee — organized workshops on LLMs, model-building',
            'Core board member — oversaw events, interviewed new members'
        ]
    }
];

const skills = {
    'Languages': ['Python', 'C', 'Java', 'R', 'JavaScript', 'HTML/CSS', 'Tcl/Tk'],
    'Frameworks & Tools': ['Flask', 'Node.js', 'Nest.js', 'Streamlit', 'Git', 'Azure', 'GCP', 'Firebase'],
    'Databases & Platforms': ['Azure SQL', 'Databricks', 'MongoDB', 'Elasticsearch', 'OpenAI APIs', 'Vertex AI']
};

const files = {
    'description.txt': 'B.S./M.S. Computer Science @ University of Chicago | GPA: 3.818 | June 2028\nInterested in large-scale data platforms, AI-driven systems, and distributed infrastructure.',
    'links.txt': '<a href="' + links.github + '" target="_blank" class="link">github.com/efe-u</a>\n<a href="' + links.linkedin + '" target="_blank" class="link">linkedin.com/in/nusret-efe-ucer</a>\n<a href="mailto:efeucer@uchicago.edu" class="link">efeucer@uchicago.edu</a>'
};

// =============================================================
// STATE
// =============================================================

const openWindows = {};
let currentContentId = null;
let zCounter = 10;
let activitiesOpen = false;
let terminalInitDone = false;
let terminalEl = null;

const windowConfigs = {
    terminal: { title: 'Terminal', type: 'terminal' },
    about:    { title: 'About Me', type: 'content' },
    projects: { title: 'Projects', type: 'content' },
    experience: { title: 'Experience', type: 'content' },
    skills:   { title: 'Skills', type: 'content' },
    links:    { title: 'Links', type: 'content' }
};

// =============================================================
// CLOCK
// =============================================================

function updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const el = document.getElementById('clock');
    if (el) el.textContent = days[now.getDay()] + ' ' + months[now.getMonth()] + ' ' + now.getDate() + '  ' + h + ':' + m;
}

// =============================================================
// WINDOW MANAGER
// =============================================================

function openWindow(id) {
    if (activitiesOpen) toggleActivities();

    const config = windowConfigs[id];
    if (!config) return;

    if (id === 'terminal') {
        if (openWindows.terminal) {
            focusWindow('terminal');
            return;
        }
        const win = createWindowEl(id, config);
        document.getElementById('windowsLayer').appendChild(win);
        openWindows.terminal = { element: win };
        focusWindow('terminal');

        terminalEl = win.querySelector('#terminal');
        if (!terminalInitDone) {
            terminalInitDone = true;
            setTimeout(runInitSequence, 500);
        } else {
            createInputLine();
        }
        return;
    }

    // Content window — close previous one
    if (currentContentId && openWindows[currentContentId]) {
        const prev = openWindows[currentContentId];
        prev.element.remove();
        delete openWindows[currentContentId];
    }

    const win = createWindowEl(id, config);
    document.getElementById('windowsLayer').appendChild(win);
    openWindows[id] = { element: win };
    currentContentId = id;
    focusWindow(id);

    const body = win.querySelector('.window-body');
    renderWindowContent(id, body);
}

function closeWindow(id) {
    const win = openWindows[id];
    if (!win) return;

    win.element.classList.add('closing');
    setTimeout(() => {
        win.element.remove();
        delete openWindows[id];
        if (id === 'terminal') {
            terminalEl = null;
        }
        if (id === currentContentId) {
            currentContentId = null;
        }
    }, 200);
}

function focusWindow(id) {
    const win = openWindows[id];
    if (!win) return;
    zCounter++;
    win.element.style.zIndex = zCounter;
}

function createWindowEl(id, config) {
    const win = document.createElement('div');
    const typeClass = config.type === 'terminal' ? 'window-terminal' : 'window-content';
    win.className = 'window ' + typeClass;
    win.dataset.windowId = id;
    win.style.zIndex = ++zCounter;

    const bodyInner = id === 'terminal' ? '<div class="terminal-pane" id="terminal"></div>' : '';

    win.innerHTML =
        '<div class="window-header" onmousedown="focusWindow(\'' + id + '\')">' +
            '<span class="window-title">' + config.title + '</span>' +
            '<button class="window-close" onclick="event.stopPropagation(); closeWindow(\'' + id + '\')">' +
                '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
            '</button>' +
        '</div>' +
        '<div class="window-body">' + bodyInner + '</div>';

    win.addEventListener('mousedown', function() { focusWindow(id); });
    return win;
}

// =============================================================
// CONTENT RENDERERS
// =============================================================

function renderWindowContent(id, body) {
    const renderers = {
        about: renderAbout,
        projects: renderProjects,
        experience: renderExperience,
        skills: renderSkills,
        links: renderLinks
    };
    if (renderers[id]) {
        body.innerHTML = '<div class="content-body">' + renderers[id]() + '</div>';
    }
}

function renderAbout() {
    return '' +
        '<div class="about-header">' +
            '<img class="about-avatar" src="profile.jpg" alt="NEU" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="about-avatar about-avatar-fallback" style="display:none">NEU</div>' +
            '<div>' +
                '<h1 class="about-name">Nusret Efe Ucer</h1>' +
                '<p class="about-tagline">B.S./M.S. Computer Science</p>' +
                '<p class="about-meta">University of Chicago | GPA: 3.818 | Expected June 2028</p>' +
            '</div>' +
        '</div>' +
        '<p class="about-bio">Interested in building large-scale data platforms, AI-driven systems, and distributed infrastructure.</p>' +
        '<h2 class="section-heading">Current Roles</h2>' +
        '<div class="about-roles">' +
            '<div class="role-card">' +
                '<span class="role-title">ML Engineer (Part-Time) / ML Engineering Intern</span>' +
                '<span class="role-org">G LNK (YC W25)</span>' +
                '<span class="role-period">June 2025 – Present</span>' +
            '</div>' +
            '<div class="role-card">' +
                '<span class="role-title">Ground Station Software Engineer</span>' +
                '<span class="role-org">UChicago PULSE-A</span>' +
                '<span class="role-period">October 2024 – Present</span>' +
            '</div>' +
            '<div class="role-card">' +
                '<span class="role-title">AI/ML Committee Co-director</span>' +
                '<span class="role-org">UChicago ACM</span>' +
                '<span class="role-period">October 2024 – Present</span>' +
            '</div>' +
        '</div>';
}

function renderProjects() {
    var cards = '';
    Object.entries(projects).forEach(function(entry) {
        var name = entry[0], proj = entry[1];
        cards +=
            '<div class="project-card" onclick="window.open(\'' + proj.link + '\', \'_blank\')">' +
                '<h3 class="project-name">' + name + '</h3>' +
                '<p class="project-desc">' + proj.desc + '</p>' +
                '<span class="project-link">View Project \u2192</span>' +
            '</div>';
    });
    return '<div class="projects-grid">' + cards + '</div>';
}

function renderExperience() {
    var items = '';
    experiences.forEach(function(exp) {
        var bullets = exp.details.map(function(d) { return '<li>' + d + '</li>'; }).join('');
        items +=
            '<div class="timeline-item">' +
                '<div class="timeline-marker"></div>' +
                '<div class="timeline-content">' +
                    '<h3>' + exp.company + '</h3>' +
                    '<p class="timeline-role">' + exp.role + '</p>' +
                    '<p class="timeline-date">' + exp.date + '</p>' +
                    '<ul>' + bullets + '</ul>' +
                '</div>' +
            '</div>';
    });
    return '<div class="timeline">' + items + '</div>';
}

function renderSkills() {
    var groups = '';
    Object.entries(skills).forEach(function(entry) {
        var category = entry[0], items = entry[1];
        var chipHtml = items.map(function(item) { return '<span class="chip">' + item + '</span>'; }).join('');
        groups +=
            '<div class="skills-group">' +
                '<h3>' + category + '</h3>' +
                '<div class="chips">' + chipHtml + '</div>' +
            '</div>';
    });
    return groups;
}

function renderLinks() {
    return '' +
        '<div class="links-list">' +
            '<a href="' + links.github + '" target="_blank" class="link-card">' +
                '<div class="link-icon-box">GH</div>' +
                '<div><div class="link-title">GitHub</div><div class="link-url">github.com/efe-u</div></div>' +
            '</a>' +
            '<a href="' + links.linkedin + '" target="_blank" class="link-card">' +
                '<div class="link-icon-box">IN</div>' +
                '<div><div class="link-title">LinkedIn</div><div class="link-url">linkedin.com/in/nusret-efe-ucer</div></div>' +
            '</a>' +
            '<a href="mailto:efeucer@uchicago.edu" class="link-card">' +
                '<div class="link-icon-box">@</div>' +
                '<div><div class="link-title">Email</div><div class="link-url">efeucer@uchicago.edu</div></div>' +
            '</a>' +
        '</div>';
}

// =============================================================
// ACTIVITIES
// =============================================================

function toggleActivities() {
    var overlay = document.getElementById('activitiesOverlay');
    activitiesOpen = !activitiesOpen;

    if (activitiesOpen) {
        renderActivities();
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function renderActivities() {
    var container = document.getElementById('activitiesContent');
    var windowEls = document.querySelectorAll('#windowsLayer .window');

    var html = '<h2 class="activities-title">Open Windows</h2><div class="activities-grid">';

    if (windowEls.length === 0) {
        html += '<p class="activities-empty">No open windows. Click a dock icon to get started.</p>';
    } else {
        windowEls.forEach(function(w) {
            var id = w.dataset.windowId;
            var title = w.querySelector('.window-title').textContent;
            html +=
                '<div class="activity-card" onclick="focusWindow(\'' + id + '\'); toggleActivities();">' +
                    '<span class="activity-card-title">' + title + '</span>' +
                '</div>';
        });
    }

    html += '</div>';
    container.innerHTML = html;
}

function handleActivitiesClick(event) {
    if (event.target === event.currentTarget) {
        toggleActivities();
    }
}

// =============================================================
// TERMINAL
// =============================================================

var typeSpeed = 35;
var lineDelay = 250;

function createPrompt() {
    return '<span class="prompt-user">efe</span><span class="prompt-at">@</span><span class="prompt-host">macbook</span> <span class="prompt-path">~</span> <span class="prompt-symbol">%</span>&nbsp;';
}

function createLine(content, className) {
    var line = document.createElement('div');
    line.className = 'terminal-line' + (className ? ' ' + className : '');
    line.innerHTML = content;
    return line;
}

function addOutput(html, className, target) {
    var pane = target || terminalEl;
    if (!pane) return;
    var line = createLine(html, className || 'output');
    pane.appendChild(line);
    scrollToBottom(pane);
}

function scrollToBottom(target) {
    var el = target || terminalEl;
    if (el) el.scrollTop = el.scrollHeight;
}

function typeText(element, text) {
    return new Promise(function(resolve) {
        var i = 0;
        function next() {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
                setTimeout(next, typeSpeed + Math.random() * 20);
            } else {
                resolve();
            }
        }
        next();
    });
}

function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function handleCommand(cmd) {
    if (!terminalEl) return;
    var parts = cmd.trim().toLowerCase().split(/\s+/);
    var command = parts[0];
    var args = parts.slice(1);

    switch (command) {
        case '':
            break;

        case 'ls':
            showProjects(terminalEl);
            break;

        case 'cd':
            if (args.length === 0) {
                addOutput('usage: cd &lt;project-name&gt;', 'output', terminalEl);
            } else {
                var projectName = args[0].replace('/', '');
                if (projects[projectName]) {
                    addOutput('Opening ' + projectName + '...', 'output', terminalEl);
                    setTimeout(function() { window.open(projects[projectName].link, '_blank'); }, 500);
                } else {
                    addOutput('cd: no such directory: ' + args[0], 'error', terminalEl);
                }
            }
            break;

        case 'cat':
            if (args.length === 0) {
                addOutput('usage: cat &lt;filename&gt;', 'output', terminalEl);
            } else {
                var filename = args[0];
                if (files[filename]) {
                    files[filename].split('\n').forEach(function(line) {
                        addOutput(line, 'output', terminalEl);
                    });
                } else {
                    addOutput('cat: ' + filename + ': No such file or directory', 'error', terminalEl);
                }
            }
            break;

        case 'help':
            showHelp(terminalEl);
            break;

        case 'about':
            showAbout(terminalEl);
            break;

        case 'clear':
            terminalEl.innerHTML = '';
            return 'clear';

        case 'whoami':
            addOutput('Nusret Efe Ucer', 'output', terminalEl);
            break;

        case 'open':
            if (args.length === 0) {
                addOutput('usage: open &lt;section&gt;', 'output', terminalEl);
                addOutput('sections: about, projects, experience, skills, links', 'output', terminalEl);
            } else {
                var section = args[0];
                if (windowConfigs[section] && section !== 'terminal') {
                    openWindow(section);
                    addOutput('Opening ' + section + '...', 'output', terminalEl);
                } else {
                    addOutput('Unknown section: ' + section, 'error', terminalEl);
                }
            }
            break;

        case './experiences':
        case 'experiences':
            openWindow('experience');
            addOutput('Opening experience window...', 'output', terminalEl);
            break;

        case './skills':
        case 'skills':
            openWindow('skills');
            addOutput('Opening skills window...', 'output', terminalEl);
            break;

        default:
            addOutput('command not found: ' + command, 'error', terminalEl);
            addOutput('Type "help" for available commands', 'output', terminalEl);
    }
}

function showProjects(pane) {
    var list = Object.keys(projects).map(function(n) {
        return '<span class="clickable-project" data-project="' + n + '">' + n + '/</span>';
    }).join('<br>');
    addOutput(list, 'ls-output', pane);
}

function showHelp(pane) {
    addOutput('Available commands:', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="cat description.txt">cat</span> &lt;file&gt;      <span class="cmd-desc">read a file</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="ls">ls</span>              <span class="cmd-desc">list projects</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="cd">cd</span> &lt;name&gt;       <span class="cmd-desc">open a project link</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="open">open</span> &lt;section&gt;  <span class="cmd-desc">open a window (about, projects, ...)</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="experiences">experiences</span>     <span class="cmd-desc">view experience window</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="skills">skills</span>          <span class="cmd-desc">view skills window</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="clear">clear</span>           <span class="cmd-desc">clear terminal</span>', 'output', pane);
    addOutput('  <span class="cmd clickable-cmd" data-cmd="help">help</span>            <span class="cmd-desc">show this help</span>', 'output', pane);
}

function catFile(filename, pane) {
    if (files[filename]) {
        files[filename].split('\n').forEach(function(line) {
            addOutput(line, 'output', pane);
        });
    }
}

function showAbout(pane) {
    addOutput('<span class="comment"># About Nusret Efe Ucer</span>', 'output', pane);
    addOutput('', 'output', pane);
    addOutput('B.S./M.S. Computer Science @ University of Chicago | GPA: 3.818', 'output', pane);
    addOutput('Building large-scale data platforms, AI-driven systems, and distributed infrastructure.', 'output', pane);
    addOutput('', 'output', pane);
    addOutput('<span class="comment"># Currently:</span>', 'output', pane);
    addOutput('  ML Engineer @ G LNK (YC W25)', 'output', pane);
    addOutput('  Ground Station Engineer @ UChicago PULSE-A', 'output', pane);
    addOutput('  AI/ML Co-director @ UChicago ACM', 'output', pane);
    addOutput('', 'output', pane);
    addOutput('<span class="comment"># Quick commands:</span>', 'output', pane);
    addOutput('  <span class="clickable-cmd" data-cmd="open about">open about</span>        \u2014 about window', 'output', pane);
    addOutput('  <span class="clickable-cmd" data-cmd="open projects">open projects</span>     \u2014 projects window', 'output', pane);
    addOutput('  <span class="clickable-cmd" data-cmd="open experience">open experience</span>   \u2014 experience window', 'output', pane);
    addOutput('  <span class="clickable-cmd" data-cmd="open skills">open skills</span>       \u2014 skills window', 'output', pane);
}

function runAbout() {
    if (!terminalEl) return;
    terminalEl.appendChild(createLine(createPrompt() + '<span class="command">about</span>'));
    showAbout(terminalEl);
    terminalEl.appendChild(createLine('&nbsp;'));
    createInputLine();
}

function showTabComplete(input) {
    if (!terminalEl) return;
    var val = input.value.trim().toLowerCase();
    var commands = ['ls', 'cd', 'cat', 'open', 'clear', 'help', 'whoami', 'experiences', 'skills'];
    var projectNames = Object.keys(projects);

    if (val.startsWith('cd ')) {
        var partial = val.slice(3);
        var matches = projectNames.filter(function(p) { return p.startsWith(partial); });
        if (matches.length === 1) { input.value = 'cd ' + matches[0]; }
        else if (matches.length > 1) { addOutput(matches.join('  '), 'tab-complete', terminalEl); }
    } else if (val.startsWith('open ')) {
        var partialSec = val.slice(5);
        var sections = Object.keys(windowConfigs).filter(function(s) { return s !== 'terminal' && s.startsWith(partialSec); });
        if (sections.length === 1) { input.value = 'open ' + sections[0]; }
        else if (sections.length > 1) { addOutput(sections.join('  '), 'tab-complete', terminalEl); }
    } else if (val === '') {
        addOutput('<span class="tab-hint">commands: ' + commands.join('  ') + '</span>', 'tab-complete', terminalEl);
    } else {
        var cmdMatches = commands.filter(function(c) { return c.startsWith(val); });
        if (cmdMatches.length === 1) { input.value = cmdMatches[0]; }
        else if (cmdMatches.length > 1) { addOutput(cmdMatches.join('  '), 'tab-complete', terminalEl); }
    }
}

function createInputLine() {
    if (!terminalEl) return;
    var inputLine = document.createElement('div');
    inputLine.className = 'terminal-line input-line';
    inputLine.innerHTML = createPrompt();

    var input = document.createElement('input');
    input.type = 'text';
    input.autofocus = true;

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var cmd = input.value;
            var cmdTrimmed = cmd.trim().toLowerCase();
            inputLine.innerHTML = createPrompt() + '<span class="command">' + cmd + '</span>';
            var result = handleCommand(cmd);
            if (cmdTrimmed !== 'clear') {
                terminalEl.appendChild(createLine('&nbsp;'));
            }
            createInputLine();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            showTabComplete(input);
        }
    });

    inputLine.appendChild(input);
    terminalEl.appendChild(inputLine);
    input.focus();
    scrollToBottom(terminalEl);
}

// =============================================================
// INIT SEQUENCE
// =============================================================

var initSequence = [
    { type: 'command', text: 'echo "Hi, I\'m Nusret Efe Ucer"' },
    { type: 'output', html: 'Hi, I\'m Nusret Efe Ucer' },
    { type: 'output', html: '<span class="comment"># Computer Science student @ UChicago \u2014 projects, experience, links</span>' },
    { type: 'empty' },
    { type: 'command', text: 'cat links.txt' },
    { type: 'cat', file: 'links.txt' },
    { type: 'empty' },
    { type: 'output', html: '<span class="comment"># type "help" for commands, or use the desktop icons</span>' },
    { type: 'empty' }
];

async function runInitSequence() {
    if (!terminalEl) return;

    for (var i = 0; i < initSequence.length; i++) {
        var item = initSequence[i];
        switch (item.type) {
            case 'hint':
                addOutput(item.html, 'hint', terminalEl);
                await sleep(100);
                break;

            case 'command':
                await sleep(lineDelay);
                var cmdLine = createLine(createPrompt() + '<span class="command"></span>');
                terminalEl.appendChild(cmdLine);
                var cmdSpan = cmdLine.querySelector('.command');
                await typeText(cmdSpan, item.text);
                await sleep(lineDelay);
                break;

            case 'output':
                addOutput(item.html, 'output', terminalEl);
                await sleep(150);
                break;

            case 'projects':
                showProjects(terminalEl);
                await sleep(lineDelay);
                break;

            case 'empty':
                terminalEl.appendChild(createLine('&nbsp;'));
                await sleep(100);
                break;

            case 'help':
                showHelp(terminalEl);
                await sleep(lineDelay);
                break;

            case 'cat':
                catFile(item.file, terminalEl);
                await sleep(lineDelay);
                break;
        }
        scrollToBottom(terminalEl);
    }

    createInputLine();
}

// =============================================================
// INITIALIZATION
// =============================================================

document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 60000);
    openWindow('terminal');
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activitiesOpen) {
        toggleActivities();
    }
});

// Focus terminal input when clicking terminal pane
document.addEventListener('click', function(e) {
    // Handle clickable commands
    var cmdEl = e.target.closest('.clickable-cmd');
    if (cmdEl && terminalEl) {
        var cmd = cmdEl.dataset.cmd;
        if (cmd) {
            runClickedCommand(cmd);
            return;
        }
    }

    // Handle clickable project names
    var projEl = e.target.closest('.clickable-project');
    if (projEl && terminalEl) {
        var projName = projEl.dataset.project;
        if (projName && projects[projName]) {
            runClickedCommand('cd ' + projName);
            return;
        }
    }

    if (terminalEl && terminalEl.contains(e.target)) {
        var input = terminalEl.querySelector('input');
        if (input) input.focus();
    }
});

function runClickedCommand(cmd) {
    if (!terminalEl) return;
    var existingInput = terminalEl.querySelector('.input-line');
    if (existingInput) {
        existingInput.className = 'terminal-line';
        existingInput.innerHTML = createPrompt() + '<span class="command">' + cmd + '</span>';
    }
    handleCommand(cmd);
    var cmdTrimmed = cmd.trim().toLowerCase();
    if (cmdTrimmed !== 'clear') {
        terminalEl.appendChild(createLine('&nbsp;'));
    }
    createInputLine();
}

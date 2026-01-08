let activePane = 'terminal';
let programs = {}; // Store launched programs

const typeSpeed = 35;
const lineDelay = 250;

// Project data
const projects = {
    'handsin': {
        desc: 'Sign-language conversational AI system — HackTech 2025 @ Caltech',
        link: 'https://devpost.com/software/handsin'
    },
    'r19q-mutation': {
        desc: 'Molecular dynamics simulation analyzing SBDS protein mutation',
        link: 'https://github.com/efe-u/R19Q-Mutation-in-the-2L9N-SBDS-Protein/blob/main/R19Q-Mutation-in-the-2L9N-SBDS-Protein.pdf'
    },
    'tennis-motion-ai': {
        desc: 'AI-driven motion analysis system for tennis @ TU Dortmund',
        link: 'https://github.com/efe-u/AI_Tennis_Coach'
    }
};

const links = {
    github: 'https://github.com/efe-u',
    linkedin: 'https://www.linkedin.com/in/nusret-efe-ucer-868296243/'
};

// Experiences data
const experiences = [
    {
        company: 'G LNK (YC W25)',
        role: 'ML Engineer (Part-Time) / ML Engineering Intern',
        date: 'June 2025 – Present',
        details: [
            'Built company database from zero — unified 300+ gov healthcare datasets',
            'Transformed 10⁹+ raw records into 10⁷-scale Elasticsearch/Databricks/MongoDB',
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
        company: 'Technische Universität Dortmund',
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

// Skills data for another program
const skills = {
    'Languages': ['Python', 'C', 'Java', 'R', 'JavaScript', 'HTML/CSS', 'Tcl/Tk'],
    'Frameworks/Tools': ['Flask', 'Node.js', 'Nest.js', 'Streamlit', 'Git', 'Azure', 'GCP', 'Firebase'],
    'Databases/Platforms': ['Azure SQL', 'Databricks', 'MongoDB', 'Elasticsearch', 'OpenAI APIs', 'Vertex AI']
};

// Virtual file system
const files = {
    'description.txt': `B.S./M.S. Computer Science @ University of Chicago | GPA: 3.818 | June 2028
Interested in large-scale data platforms, AI-driven systems, and distributed infrastructure.`,
    'links.txt': `<a href="${links.github}" target="_blank" class="link">github.com/efe-u</a>
<a href="${links.linkedin}" target="_blank" class="link">linkedin.com/in/nusret-efe-ucer</a>
<a href="mailto:efeucer@uchicago.edu" class="link">efeucer@uchicago.edu</a>`
};

function getActiveTerminal() {
    if (activePane === 'terminal') {
        return document.getElementById('terminal');
    }
    const activeProgram = programs[activePane];
    if (activeProgram) {
        return activeProgram.content;
    }
    return document.getElementById('terminal');
}

function createPrompt(pane = 'main') {
    if (pane !== 'main' && pane !== 'terminal') {
        return `<span class="prompt-user">efe</span><span class="prompt-at">@</span><span class="prompt-host">macbook</span> <span class="prompt-path">~/${pane}</span> <span class="prompt-symbol">%</span>&nbsp;`;
    }
    return `<span class="prompt-user">efe</span><span class="prompt-at">@</span><span class="prompt-host">macbook</span> <span class="prompt-path">~</span> <span class="prompt-symbol">%</span>&nbsp;`;
}

function createLine(content, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = content;
    return line;
}

function addOutput(html, className = 'output', targetPane = null) {
    const pane = targetPane || getActiveTerminal();
    const line = createLine(html, className);
    pane.appendChild(line);
    scrollToBottom(pane);
}

function scrollToBottom(pane = null) {
    const target = pane || getActiveTerminal();
    target.scrollTop = target.scrollHeight;
}

async function typeText(element, text) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(typeSpeed + Math.random() * 20);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function switchPane(paneId) {
    activePane = paneId;
    
    // Focus input in active pane
    const activeTerminal = getActiveTerminal();
    const input = activeTerminal?.querySelector('input');
    if (input) input.focus();
}

function expandProgram(programId) {
    const prog = programs[programId];
    if (!prog) return;
    
    // If already expanded, collapse it
    if (prog.panel.classList.contains('expanded')) {
        prog.panel.classList.remove('expanded');
        prog.panel.classList.add('collapsed');
        // Switch back to main terminal
        switchPane('terminal');
        return;
    }
    
    // Otherwise expand this one and collapse others
    Object.keys(programs).forEach(id => {
        const p = programs[id];
        if (id === programId) {
            p.panel.classList.add('expanded');
            p.panel.classList.remove('collapsed');
        } else {
            p.panel.classList.remove('expanded');
            p.panel.classList.add('collapsed');
        }
    });
    activePane = programId;
    
    // Focus input
    const input = prog.content.querySelector('input');
    if (input) input.focus();
}

// Command handler for main terminal
function handleCommand(cmd) {
    const terminal = document.getElementById('terminal');
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
        case '':
            break;
            
        case 'ls':
            showProjects(terminal);
            break;
            
        case 'cd':
            if (args.length === 0) {
                addOutput('usage: cd <project-name>', 'output', terminal);
            } else {
                const projectName = args[0].replace('/', '');
                if (projects[projectName]) {
                    addOutput(`Opening ${projectName}...`, 'output', terminal);
                    setTimeout(() => {
                        window.open(projects[projectName].link, '_blank');
                    }, 500);
                } else {
                    addOutput(`cd: no such directory: ${args[0]}`, 'error', terminal);
                }
            }
            break;
            
        case 'cat':
            if (args.length === 0) {
                addOutput('usage: cat <filename>', 'output', terminal);
            } else {
                const filename = args[0];
                if (files[filename]) {
                    const lines = files[filename].split('\n');
                    lines.forEach(line => addOutput(line, 'output', terminal));
                } else {
                    addOutput(`cat: ${filename}: No such file or directory`, 'error', terminal);
                }
            }
            break;
            
        case 'help':
            showHelp(terminal);
            break;
            
        case 'about':
            showAbout(terminal);
            break;
            
        case 'clear':
            terminal.innerHTML = '';
            return 'clear';
            
        case 'whoami':
            addOutput('Nusret Efe Ucer', 'output', terminal);
            break;
            
        case 'about':
            showAbout(terminal);
            break;
            
        case './experiences':
        case 'experiences':
            launchProgram('experiences');
            return 'program';
            
        case './skills':
        case 'skills':
            launchProgram('skills');
            return 'program';
            
        default:
            addOutput(`command not found: ${command}`, 'error', terminal);
            addOutput('Type "help" for available commands', 'output', terminal);
    }
}

// Command handler for program panes
function handleProgramCommand(programId, cmd) {
    const prog = programs[programId];
    if (!prog) return;
    
    const pane = prog.content;
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];

    switch (command) {
        case '':
            break;
            
        case 'exit':
            closeProgram(programId);
            return 'exit';
            
        case 'clear':
            pane.innerHTML = '';
            return 'clear';
            
        case 'help':
            addOutput('Program commands:', 'output', pane);
            addOutput('  <span class="cmd">exit</span>   <span class="cmd-desc">close this program</span>', 'output', pane);
            addOutput('  <span class="cmd">clear</span>  <span class="cmd-desc">clear output</span>', 'output', pane);
            break;
            
        default:
            addOutput(`command not found: ${command}`, 'error', pane);
            addOutput('Type "exit" to close', 'output', pane);
    }
}

function showProjects(pane) {
    const projectList = Object.keys(projects).map(name => 
        `<a href="${projects[name].link}" target="_blank" class="project-link">${name}/</a>`
    ).join('<br>');
    addOutput(projectList, 'ls-output', pane);
}

function showHelp(pane) {
    addOutput('Available commands:', 'output', pane);
    addOutput('  <span class="cmd">cat</span> &lt;file&gt;      <span class="cmd-desc">read a file</span>', 'output', pane);
    addOutput('  <span class="cmd">ls</span>              <span class="cmd-desc">list projects</span>', 'output', pane);
    addOutput('  <span class="cmd">cd</span> &lt;name&gt;       <span class="cmd-desc">open a project</span>', 'output', pane);
    addOutput('  <span class="cmd">./experiences</span>   <span class="cmd-desc">view work experience</span>', 'output', pane);
    addOutput('  <span class="cmd">./skills</span>        <span class="cmd-desc">view skills</span>', 'output', pane);
    addOutput('  <span class="cmd">clear</span>           <span class="cmd-desc">clear terminal</span>', 'output', pane);
    addOutput('  <span class="cmd">help</span>            <span class="cmd-desc">show this help</span>', 'output', pane);
}

function catFile(filename, pane) {
    if (files[filename]) {
        const lines = files[filename].split('\n');
        lines.forEach(line => addOutput(line, 'output', pane));
    }
}

function ensureRightPane() {
    let rightPane = document.getElementById('rightPane');
    if (!rightPane) {
        const panesContainer = document.querySelector('.terminal-panes');
        rightPane = document.createElement('div');
        rightPane.className = 'terminal-pane right-pane';
        rightPane.id = 'rightPane';
        panesContainer.appendChild(rightPane);
    }
    return rightPane;
}

async function launchProgram(programId) {
    if (programs[programId]) {
        expandProgram(programId);
        return;
    }
    
    const rightPane = ensureRightPane();
    
    // Create program panel
    const panel = document.createElement('div');
    panel.className = 'program-panel expanded';
    panel.id = `panel-${programId}`;
    
    const header = document.createElement('div');
    header.className = 'program-header';
    header.innerHTML = `<span class="program-title">${programId}</span><span class="program-status">running</span>`;
    header.onclick = () => expandProgram(programId);
    
    const content = document.createElement('div');
    content.className = 'program-content';
    
    panel.appendChild(header);
    panel.appendChild(content);
    rightPane.appendChild(panel);
    
    // Collapse other programs
    Object.keys(programs).forEach(id => {
        programs[id].panel.classList.remove('expanded');
        programs[id].panel.classList.add('collapsed');
    });
    
    programs[programId] = { panel, content, header };
    activePane = programId;
    
    // Print program content
    if (programId === 'experiences') {
        await printExperiencesTree(content);
    } else if (programId === 'skills') {
        await printSkillsTree(content);
    }
    
    // Add input line
    createProgramInputLine(programId);
}

async function printExperiencesTree(pane) {
    await sleep(200);
    addOutput('<span class="exp-tree-title">experiences/</span>', 'output', pane);
    addOutput('│', 'output', pane);
    
    for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        const isLast = i === experiences.length - 1;
        const branch = isLast ? '└──' : '├──';
        const indent = isLast ? '    ' : '│   ';
        
        await sleep(150);
        addOutput(`${branch} <span class="exp-company">${exp.company}/</span>`, 'output', pane);
        
        await sleep(100);
        addOutput(`${indent} <span class="exp-role">${exp.role}</span>`, 'output', pane);
        
        await sleep(80);
        addOutput(`${indent} <span class="exp-date">${exp.date}</span>`, 'output', pane);
        
        for (const detail of exp.details) {
            await sleep(60);
            addOutput(`${indent} <span class="exp-detail">· ${detail}</span>`, 'output', pane);
        }
        
        if (!isLast) {
            await sleep(60);
            addOutput('│', 'output', pane);
        }
    }
    
    addOutput('&nbsp;', 'output', pane);
}

async function printSkillsTree(pane) {
    await sleep(200);
    addOutput('<span class="exp-tree-title">skills/</span>', 'output', pane);
    addOutput('│', 'output', pane);
    
    const categories = Object.keys(skills);
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const items = skills[category];
        const isLast = i === categories.length - 1;
        const branch = isLast ? '└──' : '├──';
        const indent = isLast ? '    ' : '│   ';
        
        await sleep(150);
        addOutput(`${branch} <span class="exp-company">${category}/</span>`, 'output', pane);
        
        for (let j = 0; j < items.length; j++) {
            await sleep(60);
            addOutput(`${indent} <span class="exp-detail">· ${items[j]}</span>`, 'output', pane);
        }
        
        if (!isLast) {
            await sleep(60);
            addOutput('│', 'output', pane);
        }
    }
    
    addOutput('&nbsp;', 'output', pane);
}

function closeProgram(programId) {
    const prog = programs[programId];
    if (!prog) return;
    
    prog.panel.remove();
    delete programs[programId];
    
    // If no more programs, remove right pane
    if (Object.keys(programs).length === 0) {
        const rightPane = document.getElementById('rightPane');
        if (rightPane) rightPane.remove();
        switchPane('terminal');
    } else {
        // Expand another program
        const remaining = Object.keys(programs)[0];
        expandProgram(remaining);
    }
}

function createProgramInputLine(programId) {
    const prog = programs[programId];
    if (!prog) return;
    
    const pane = prog.content;
    
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line input-line';
    inputLine.innerHTML = createPrompt(programId);
    
    const input = document.createElement('input');
    input.type = 'text';
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            const cmdTrimmed = cmd.trim().toLowerCase();
            
            inputLine.innerHTML = createPrompt(programId) + `<span class="command">${cmd}</span>`;
            
            const result = handleProgramCommand(programId, cmd);
            
            if (result === 'exit') return;
            
            if (cmdTrimmed !== 'clear') {
                pane.appendChild(createLine('&nbsp;'));
            }
            
            createProgramInputLine(programId);
        }
    });
    
    inputLine.appendChild(input);
    pane.appendChild(inputLine);
    input.focus();
    scrollToBottom(pane);
}

// Create interactive input for main terminal
function createInputLine() {
    const terminal = document.getElementById('terminal');
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line input-line';
    inputLine.innerHTML = createPrompt();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.autofocus = true;
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            const cmdTrimmed = cmd.trim().toLowerCase();
            
            inputLine.innerHTML = createPrompt() + `<span class="command">${cmd}</span>`;
            
            const result = handleCommand(cmd);
            
            if (cmdTrimmed !== 'clear' && result !== 'program') {
                terminal.appendChild(createLine('&nbsp;'));
            }
            
            createInputLine();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            showTabComplete(input);
        }
    });
    
    inputLine.appendChild(input);
    terminal.appendChild(inputLine);
    input.focus();
    scrollToBottom(terminal);
}

function showTabComplete(input) {
    const terminal = document.getElementById('terminal');
    const val = input.value.trim().toLowerCase();
    const commands = ['ls', 'cd', 'clear', 'help', 'whoami', './experiences', './skills'];
    const projectNames = Object.keys(projects);
    
    if (val.startsWith('cd ')) {
        const partial = val.slice(3);
        const matches = projectNames.filter(p => p.startsWith(partial));
        if (matches.length === 1) {
            input.value = 'cd ' + matches[0];
        } else if (matches.length > 1) {
            addOutput(matches.join('  '), 'tab-complete', terminal);
        }
    } else if (val === '') {
        addOutput('<span class="tab-hint">commands: ' + commands.join('  ') + '</span>', 'tab-complete', terminal);
    } else {
        const matches = commands.filter(c => c.startsWith(val));
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            addOutput(matches.join('  '), 'tab-complete', terminal);
        }
    }
}

// Initial sequence
const initSequence = [
    { type: 'hint', html: '# Personal website — type "help" or click <span class="hint-link" onclick="runAbout()">About</span>' },
    { type: 'empty' },
    { type: 'command', text: 'echo "Hi, I\'m Nusret Efe Ucer"' },
    { type: 'output', html: 'Hi, I\'m Nusret Efe Ucer' },
    { type: 'output', html: '<span class="comment"># Computer Science student @ UChicago — projects, experience, links</span>' },
    { type: 'empty' },
    { type: 'command', text: 'cat description.txt' },
    { type: 'cat', file: 'description.txt' },
    { type: 'empty' },
    { type: 'command', text: 'cat links.txt' },
    { type: 'cat', file: 'links.txt' },
    { type: 'empty' },
    { type: 'command', text: 'ls projects/' },
    { type: 'projects' },
    { type: 'empty' },
    { type: 'command', text: 'help' },
    { type: 'help' },
    { type: 'empty' }
];

function runAbout() {
    const terminal = document.getElementById('terminal');
    // Add command line
    terminal.appendChild(createLine(createPrompt() + '<span class="command">about</span>'));
    // Run about command
    showAbout(terminal);
    terminal.appendChild(createLine('&nbsp;'));
    createInputLine();
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
    addOutput('  ./experiences   — view work history', 'output', pane);
    addOutput('  ./skills        — view technical skills', 'output', pane);
    addOutput('  ls              — list projects', 'output', pane);
    addOutput('  cat links.txt   — social links', 'output', pane);
}

async function runInitSequence() {
    const terminal = document.getElementById('terminal');
    
    for (const item of initSequence) {
        switch (item.type) {
            case 'hint':
                addOutput(item.html, 'hint', terminal);
                await sleep(100);
                break;
                
            case 'command':
                await sleep(lineDelay);
                const cmdLine = createLine(createPrompt() + '<span class="command"></span>');
                terminal.appendChild(cmdLine);
                const cmdSpan = cmdLine.querySelector('.command');
                await typeText(cmdSpan, item.text);
                await sleep(lineDelay);
                break;
                
            case 'output':
                addOutput(item.html, 'output', terminal);
                await sleep(150);
                break;
                
            case 'projects':
                showProjects(terminal);
                await sleep(lineDelay);
                break;
                
            case 'empty':
                terminal.appendChild(createLine('&nbsp;'));
                await sleep(100);
                break;
                
            case 'help':
                showHelp(terminal);
                await sleep(lineDelay);
                break;
                
            case 'cat':
                catFile(item.file, terminal);
                await sleep(lineDelay);
                break;
                
            case 'program':
                await launchProgram(item.name);
                switchPane('terminal');
                terminal.appendChild(createLine('&nbsp;'));
                await sleep(300);
                break;
        }
        scrollToBottom(terminal);
    }
    
    createInputLine();
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runInitSequence, 500);
});

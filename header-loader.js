// Header Loader - Carrega o header dinamicamente em todas as páginas
(function() {
    'use strict';

    // Função para carregar o header
    function loadHeader() {
        // Determinar o caminho relativo correto baseado na estrutura de pastas
        const currentPath = window.location.pathname;
        let headerPath = 'header.html';
        let pathPrefix = '';
        
        // Se estiver em uma subpasta (fractals/, strikes/, raids/, meta-events/)
        const isInSubfolder = currentPath.includes('/fractals/') || 
                              currentPath.includes('/strikes/') || 
                              currentPath.includes('/raids/') || 
                              currentPath.includes('/meta-events/');
        
        if (isInSubfolder) {
            headerPath = '../header.html';
            pathPrefix = '../';
        }

        // Fazer fetch do header
        fetch(headerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Header não encontrado');
                }
                return response.text();
            })
            .then(html => {
                // Ajustar os caminhos relativos se estiver em subpasta
                if (isInSubfolder) {
                    html = html.replace(/href="index\.html"/g, 'href="../index.html"');
                    html = html.replace(/src="logo\.png"/g, 'src="../logo.png"');
                    html = html.replace(/src="icon\//g, 'src="../icon/');
                    html = html.replace(/src="global-search\.js"/g, 'src="../global-search.js"');
                }
                
                // Criar um container temporário
                const temp = document.createElement('div');
                temp.innerHTML = html;
                
                // Separar scripts do HTML
                const scripts = temp.querySelectorAll('script');
                const scriptUrls = [];
                scripts.forEach(script => {
                    if (script.src) {
                        scriptUrls.push(script.src);
                        script.remove(); // Remover do temp para inserir depois
                    }
                });
                
                // Inserir os elementos do header no body
                const body = document.body;
                const firstChild = body.firstChild;
                
                // Inserir cada elemento do header no início do body
                while (temp.firstChild) {
                    body.insertBefore(temp.firstChild, firstChild);
                }
                
                // Carregar scripts dinamicamente
                scriptUrls.forEach(url => {
                    const script = document.createElement('script');
                    script.src = url;
                    document.body.appendChild(script);
                });
                
                // Disparar evento customizado para indicar que o header foi carregado
                const event = new Event('headerLoaded');
                document.dispatchEvent(event);
                
                console.log('✓ Header carregado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao carregar header:', error);
            });
    }

    // Carregar o header quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();

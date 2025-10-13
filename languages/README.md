# Sistema de Traduções - NGT Site

## 📁 Estrutura de Arquivos

```
/languages/
  ├── pt.json  # Traduções em Português
  ├── en.json  # Traduções em Inglês
  └── es.json  # Traduções em Espanhol
```

## 🔧 Como Funciona

O sistema carrega as traduções de arquivos JSON externos de forma assíncrona ao iniciar a página.

### Vantagens desta abordagem:
✅ **Organização**: Cada idioma em seu próprio arquivo
✅ **Manutenção**: Fácil adicionar/editar traduções
✅ **Escalabilidade**: Adicionar novos idiomas é simples
✅ **Legibilidade**: JSON limpo e estruturado

## 📝 Como Adicionar um Novo Idioma

1. Crie um novo arquivo JSON em `/languages/` (ex: `fr.json` para Francês)
2. Copie a estrutura de um arquivo existente
3. Traduza os valores (mantenha as chaves iguais)
4. Atualize o array de idiomas em `language.js`:
   ```javascript
   const languages = ['pt', 'en', 'es', 'fr']; // adicione 'fr'
   ```
5. Adicione a opção no HTML:
   ```html
   <option value="fr">Français</option>
   ```

## 🔑 Como Adicionar Novas Traduções

1. Abra cada arquivo JSON em `/languages/`
2. Adicione a nova chave e valor:
   ```json
   {
     "sua-nova-chave": "Texto traduzido"
   }
   ```
3. Use no HTML com `data-translate`:
   ```html
   <span data-translate="sua-nova-chave">Texto padrão</span>
   ```

## 📋 Estrutura do JSON

```json
{
  "chave-de-traducao": "Texto traduzido",
  "welcome": "Bem-vindo ao NGT Site",
  "back-button": "← Voltar",
  "menu1-title": "Fractals"
}
```

### Convenções de nomenclatura:
- Use kebab-case (com hífens)
- Seja descritivo: `menu1-page-title` ao invés de `m1t`
- Agrupe por contexto: `menu1-`, `menu2-`, `button-`, etc.

## 🚀 Carregamento

O arquivo `language.js` automaticamente:
1. Carrega todos os arquivos JSON ao iniciar
2. Aplica o idioma salvo no localStorage
3. Atualiza todos os elementos com `data-translate`

## 🔄 Troca de Idioma

```javascript
changeLanguage('en'); // Troca para Inglês
```

O idioma é salvo automaticamente no localStorage e persiste entre páginas.

## 📦 Arquivos Envolvidos

- `/languages/*.json` - Arquivos de tradução
- `language.js` - Sistema de gerenciamento de traduções
- Todos os arquivos HTML - Usam `data-translate` para elementos traduzíveis

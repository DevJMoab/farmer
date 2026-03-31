# Plano de Correção: Erro 126 (Vercel Build)

## 📋 Resumo
O erro 126 (Permission Denied) no Vercel persistiu. Suspeitamos de cache corrompido ou inconsistências no arquivo `package-lock.json` injetando binários do Windows (mesmo após remover a `node_modules` do git).

---

## 🛠️ Fase 1: Diagnóstico e Análise de Dependências
*   **Agente Responsável:** `debugger`
*   [ ] Analisar o `package-lock.json` buscando por caminhos absolutos ou referências a binários Windows.
*   [ ] Verificar se existem arquivos binários estranhos na raiz do projeto (Ex: `dev.js` sem permissão ou scripts sem shebang).
*   [ ] Analisar o log de instalação de dependências da Vercel (se fornecido pelo usuário).

## 🚀 Fase 2: Configuração DevOps e Pipeline de Deploy
*   **Agente Responsável:** `devops-engineer`
*   [ ] **Limpeza de Cache**: Instruir o usuário a fazer o redeploy com "Clear Cache" no painel da Vercel.
*   [ ] **Node Version**: Validar se a versão do Node na Vercel (geralmente v20 ou v22) é 100% compatível com as dependências do Vite 8.
*   [ ] Gerar um novo `package-lock.json` localmente a partir de um `npm install` limpo se necessário.

## ✅ Fase 3: Validação Final e Testes
*   **Agente Responsável:** `test-engineer`
*   [ ] Rodar `npm run build` localmente para garantir sanidade.
*   [ ] Executar script `vulnerability_scanner.py` para conferir integridade das dependências.
*   [ ] Confirmar se o novo build na Vercel está marcado como "Building" -> "Deploying".

---
*Status: Aguardando Aprovação do Usuário*

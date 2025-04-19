// Script para garantir um build correto na Vercel
import { execSync } from 'child_process';
import fs from 'fs';

// Garantir que o diretório dist existe
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

// Executar build
try {
  console.log('Iniciando build do Vite...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build finalizado com sucesso!');
} catch (error) {
  console.error('Erro durante o build:', error);
  process.exit(1);
}

// Verificar se o build foi gerado corretamente
if (!fs.existsSync('./dist/index.html')) {
  console.error('Erro: index.html não foi gerado no diretório dist');
  process.exit(1);
}

console.log('Conteúdo do diretório dist:');
execSync('ls -la ./dist', { stdio: 'inherit' });

console.log('Build verificado e pronto para deploy!');
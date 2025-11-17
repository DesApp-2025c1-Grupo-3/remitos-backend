/**
 * Script para generar un nuevo refresh token de Gmail API
 * 
 * Este script te guiará paso a paso para obtener un nuevo refresh token
 * cuando el token actual haya expirado o sido revocado.
 * 
 * USO:
 * 1. Asegúrate de tener las credenciales OAuth2 en tu archivo .env
 * 2. Ejecuta: node scripts/generate-gmail-refresh-token.js
 * 3. Sigue las instrucciones en pantalla
 */

const readline = require('readline');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generateRefreshToken() {
  console.log('\n🔐 Generador de Refresh Token para Gmail API\n');
  console.log('Este script te ayudará a obtener un nuevo refresh token.\n');
  
  // Cargar variables de entorno desde .env si existe
  let clientId, clientSecret;
  
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        if (line.startsWith('GMAIL_CLIENT_ID=')) {
          clientId = line.split('=')[1].trim();
        }
        if (line.startsWith('GMAIL_CLIENT_SECRET=')) {
          clientSecret = line.split('=')[1].trim();
        }
      });
    }
  } catch (error) {
    console.log('⚠️  No se pudo leer el archivo .env, continuando...\n');
  }
  
  // Solicitar credenciales si no se encontraron
  if (!clientId) {
    clientId = await question('Ingresa tu GMAIL_CLIENT_ID: ');
  } else {
    console.log(`✅ GMAIL_CLIENT_ID encontrado: ${clientId.substring(0, 20)}...`);
    const useExisting = await question('¿Usar este CLIENT_ID? (s/n): ');
    if (useExisting.toLowerCase() !== 's') {
      clientId = await question('Ingresa tu nuevo GMAIL_CLIENT_ID: ');
    }
  }
  
  if (!clientSecret) {
    clientSecret = await question('Ingresa tu GMAIL_CLIENT_SECRET: ');
  } else {
    console.log(`✅ GMAIL_CLIENT_SECRET encontrado: ${clientSecret.substring(0, 10)}...`);
    const useExisting = await question('¿Usar este CLIENT_SECRET? (s/n): ');
    if (useExisting.toLowerCase() !== 's') {
      clientSecret = await question('Ingresa tu nuevo GMAIL_CLIENT_SECRET: ');
    }
  }
  
  console.log('\n📋 Instrucciones para obtener el refresh token:\n');
  console.log('1. Abre tu navegador y ve a: https://developers.google.com/oauthplayground');
  console.log('2. En la esquina superior derecha, haz clic en el ícono de configuración (⚙️)');
  console.log('3. Marca la casilla "Use your own OAuth credentials"');
  console.log('4. Ingresa tu OAuth Client ID:', clientId);
  console.log('5. Ingresa tu OAuth Client secret:', clientSecret);
  console.log('6. En el panel izquierdo, busca y selecciona:');
  console.log('   - https://mail.google.com/ (Gmail API v1)');
  console.log('7. Haz clic en "Authorize APIs"');
  console.log('8. Inicia sesión con tu cuenta de Google (gianbellone@gmail.com)');
  console.log('9. Acepta los permisos solicitados');
  console.log('10. Haz clic en "Exchange authorization code for tokens"');
  console.log('11. Copia el "Refresh token" que aparece en el panel derecho\n');
  
  const refreshToken = await question('Pega aquí el Refresh Token obtenido: ');
  
  if (!refreshToken || refreshToken.trim().length === 0) {
    console.error('❌ Error: No se proporcionó un refresh token válido');
    rl.close();
    process.exit(1);
  }
  
  console.log('\n✅ Refresh Token recibido!');
  console.log('\n📝 Actualiza tu archivo .env con el siguiente valor:\n');
  console.log(`GMAIL_REFRESH_TOKEN=${refreshToken.trim()}\n`);
  
  // Verificar si el token funciona
  console.log('🔍 Verificando el nuevo refresh token...\n');
  
  try {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    
    oauth2Client.setCredentials({
      refresh_token: refreshToken.trim()
    });
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    
    console.log('✅ ¡Token verificado exitosamente!');
    console.log(`📧 Email asociado: ${profile.data.emailAddress}\n`);
    
    // Ofrecer actualizar el archivo .env automáticamente
    const updateEnv = await question('¿Deseas actualizar el archivo .env automáticamente? (s/n): ');
    
    if (updateEnv.toLowerCase() === 's') {
      const envPath = path.join(__dirname, '..', '.env');
      
      try {
        let envContent = '';
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, 'utf8');
        } else {
          // Si no existe, crear uno nuevo basado en env.example
          const examplePath = path.join(__dirname, '..', 'env.example');
          if (fs.existsSync(examplePath)) {
            envContent = fs.readFileSync(examplePath, 'utf8');
          }
        }
        
        // Actualizar o agregar GMAIL_REFRESH_TOKEN
        const lines = envContent.split('\n');
        let found = false;
        const updatedLines = lines.map(line => {
          if (line.startsWith('GMAIL_REFRESH_TOKEN=')) {
            found = true;
            return `GMAIL_REFRESH_TOKEN=${refreshToken.trim()}`;
          }
          return line;
        });
        
        if (!found) {
          updatedLines.push(`GMAIL_REFRESH_TOKEN=${refreshToken.trim()}`);
        }
        
        fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
        console.log('✅ Archivo .env actualizado exitosamente!\n');
        console.log('⚠️  IMPORTANTE: Si estás usando Docker, reinicia el contenedor para que los cambios surtan efecto:');
        console.log('   docker compose restart app\n');
      } catch (error) {
        console.error('❌ Error actualizando el archivo .env:', error.message);
        console.log('Por favor, actualiza manualmente el archivo .env con el nuevo refresh token.\n');
      }
    }
    
  } catch (error) {
    console.error('❌ Error verificando el token:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.error('\n⚠️  El token parece ser inválido. Asegúrate de:');
      console.error('   - Haber copiado el token completo');
      console.error('   - No haber usado el token más de una vez');
      console.error('   - Haber seguido todos los pasos correctamente\n');
    }
  }
  
  rl.close();
}

// Ejecutar el script
generateRefreshToken().catch(error => {
  console.error('❌ Error inesperado:', error);
  rl.close();
  process.exit(1);
});


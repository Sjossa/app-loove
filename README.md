# frontend-app-perso

verifier si le mod_rewrite est activer sur le serveur


### 2. **Accéder à la configuration d'Apache** :
   - Cliquez sur l'icône **WampServer** dans la barre des tâches (généralement une icône verte).
   - Dans le menu contextuel, allez dans **Apache** > **httpd.conf**. Cela ouvrira le fichier de configuration d'Apache dans votre éditeur de texte par défaut.

### 3. **Activer `mod_rewrite`** :
   - Dans le fichier `httpd.conf`, cherchez cette ligne :
     ```apache
     #LoadModule rewrite_module modules/mod_rewrite.so
     ```
     - Elle sera probablement commentée (avec un `#` au début de la ligne).
     - Supprimez le `#` au début de la ligne pour décommenter et activer le module `mod_rewrite` :
     ```apache
     LoadModule rewrite_module modules/mod_rewrite.so
     ```

### 4. **Vérification de la directive `AllowOverride`** :
   - Toujours dans le fichier `httpd.conf`, cherchez cette ligne :
     ```apache
     <Directory "c:/wamp/www/">
     ```
   - Assurez-vous que cette ligne est configurée comme suit :
     ```apache
     <Directory "c:/wamp/www/">
         AllowOverride All
         ...
     </Directory>
     ```
     Cela permet à Apache de lire et d'appliquer les règles de réécriture dans le fichier `.htaccess` de votre projet.

### 5. **Redémarrer WampServer** :
   - Après avoir effectué ces modifications, enregistrez le fichier `httpd.conf` et fermez l'éditeur.
   - Cliquez sur l'icône **WampServer** dans la barre des tâches, puis sélectionnez **Redémarrer les services** ou **Restart All Services**.

### 6. **Vérification** :
   - Pour vérifier si `mod_rewrite` est activé, vous pouvez créer un fichier PHP dans le répertoire racine de votre projet (par exemple, `index.php`) avec le code suivant :
     ```php
     <?php
     phpinfo();
     ?>
     ```
   - Ouvrez ce fichier dans votre navigateur (`http://localhost/mon-projet/index.php`) et cherchez `mod_rewrite` dans la sortie de la fonction `phpinfo()`. Si le module est activé, vous devriez le voir dans la section **Loaded Modules**.

### 7. **Configurer le fichier `.htaccess`** :
   - Une fois `mod_rewrite` activé, vous pouvez créer un fichier `.htaccess` dans le répertoire de votre projet (par exemple, dans `C:/wamp/www/mon-projet`), avec les règles de réécriture que vous avez utilisées précédemment :
     ```apache
     RewriteEngine On
     RewriteBase /app-loove/
     RewriteRule ^(.*)$ /app-loove/frontend/index.html [L]
     ```

### Résumé des étapes :

1. Modifiez le fichier `httpd.conf` pour activer `mod_rewrite` et assurer que `AllowOverride` est bien configuré.
2. Redémarrez WampServer.
3. Vérifiez l'activation du module en utilisant `phpinfo()` (optionnel).
4. Créez et configurez le fichier `.htaccess` dans votre répertoire de projet.

Cela devrait activer correctement `mod_rewrite` sur WampServer et permettre à votre application de fonctionner comme prévu avec le fichier `.htaccess` pour les redirections.

Si tu rencontres un problème ou si tu as des questions supplémentaires, fais-le moi savoir ! 😊

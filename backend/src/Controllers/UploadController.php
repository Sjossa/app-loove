<?php
namespace backend\Controllers;

use backend\Models\upload;

class UploadController
{
  private $UploadModel;

  public function __construct()
  {
    $this->UploadModel = new upload();
  }

  public function photo()
  {
      if (is_dir("photo")) {
          echo "Le dossier existe déjà.";
      } else {
          if (mkdir("../src/photo", 0777, true)) {
              echo "Dossier 'photo' créé avec succès.";
          } else {
              echo "Erreur lors de la création du dossier.";
          }
      }
  }

}

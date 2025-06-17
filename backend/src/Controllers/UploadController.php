<?php

namespace backend\Controllers;

use backend\models\Upload;

class UploadController
{


  public function __construct() {}

  public function photo()
  {


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = basename($_FILES['file']['name']);
        $repertoire = 'photo/';
        $Name =  uniqid() . $fileName;
        $destination = $repertoire . $Name;


        if (!is_dir($repertoire)) {
          mkdir($repertoire, 0755, true);
        }

        if (move_uploaded_file($fileTmpPath, $destination)) {
          echo json_encode(['success' => true, 'path' => $destination]);
        } else {
          echo json_encode(['success' => false, 'error' => 'Erreur lors du déplacement du fichier.']);
        }
      } else {
        echo json_encode(['success' => false, 'error' => 'Fichier non valide ou manquant.']);
      }
    }
  }
}

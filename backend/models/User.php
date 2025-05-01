<?php
class User
{
  private $first_name;
  private $last_name;
  private $email;
  private $mdp;
  private $age;
  private $profession;


  public function __construct($first_name, $last_name, $email, $mdp, $age, $profession)
  {
    $this->first_name = $first_name;
    $this->last_name = $last_name;
    $this->email = $email;
    $this->mdp = $mdp;
    $this->age = $age;
    $this->profession = $profession;
  }


  public function getFirstName()
  {
    return $this->first_name;
  }
  public function setFirstName($first_name)
  {
    $this->first_name = $first_name;
  }

  public function getLastName()
  {
    return $this->last_name;
  }
  public function setLastName($last_name)
  {
    $this->last_name = $last_name;
  }

  public function getEmail()
  {
    return $this->email;
  }
  public function setEmail($email)
  {
    $this->email = $email;
  }

  public function getMdp()
  {
    return $this->mdp;
  }
  public function setMdp($mdp)
  {
    $this->mdp = $mdp;
  }

  public function getAge()
  {
    return $this->age;
  }
  public function setAge($age)
  {
    $this->age = $age;
  }

  public function getProfession()
  {
    return $this->profession;
  }
  public function setProfession($profession)
  {
    $this->profession = $profession;
  }
}

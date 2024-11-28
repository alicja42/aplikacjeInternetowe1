<?php

namespace App\Model;
use App\Service\Config;

class Race{
    private ?int $id=null;
    private ?string $city=null;
    private ?int $year=null;
    private ?string $winner=null;

    public function getId(): ?int{
        return $this->id;
    }

    public function setId(?int $id): Race{
        $this->id=$id;
        return $this;
    }

    public function getCity(): ?string{
        return $this->city;
    }

    public function setCity(?string $city): Race{
        $this->city=$city;
        return $this;
    }

    public function getYear(): ?int{
        return $this->year;
    }

    public function setYear(?int $year): Race{
        $this->year=$year;
        return $this;
    }

    public function getWinner(): ?string{
        return $this->winner;
    }

    public function setWinner(?string $winner): Race{
        $this->winner=$winner;
        return $this;
    }

    public static function fromArray(array $dane): Race{
        $race=new self();
        $race->fill($dane);
        return $race;
    }

    public function fill($array): Race{
        if(isset($array['id']) && ! $this->getId()){
            $this->setId($array['id']);
        }
        if(isset($array['city'])){
            $this->setCity($array['city']);
        }
        if(isset($array['year'])){
            $this->setYear($array['year']);
        }
        if(isset($array['winner'])){
            $this->setWinner($array['winner']);
        }
        return $this;
    }

    public static function findAll(): array{
        $pdo=new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql='select * from race';
        $statement=$pdo->prepare($sql);
        $statement->execute();
        $races=[];
        $racesArray=$statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach($racesArray as $raceArray){
            $races[]=self::fromArray($raceArray);
        }
        return $races;
    }

    public static function find($id): ?Race{
        $pdo=new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql='select * from race where id = :id';
        $statement=$pdo->prepare($sql);
        $statement->execute(['id'=>$id]);
        $raceArray=$statement->fetch(\PDO::FETCH_ASSOC);
        if(!$raceArray){
            return null;
        }
        $race=Race::fromArray($raceArray);

        return $race;
    }

    public function save(): void{
        $pdo=new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if(!$this->getId()){
            $sql="insert into race (city, year, winner) values (:city, :year, :winner)";
            $statement=$pdo->prepare($sql);
            $statement->execute([
                'city'=>$this->getCity(),
                'year'=>$this->getYear(),
                'winner'=>$this->getWinner(),]);
            $this->setId($pdo->lastInsertId());
        } else{
            $sql="update race set city=:city, year=:year, winner=:winner where id=:id";
            $statement=$pdo->prepare($sql);
            $statement->execute([
                ':city'=>$this->getCity(),
                ':year'=>$this->getYear(),
                ':winner'=>$this->getWinner(),
                ':id'=>$this->getId(),]);
        }
    }

    public function delete(): void{
        $pdo=new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql="delete from race where id = :id";
        $statement=$pdo->prepare($sql);
        $statement->execute([':id'=>$this->getId(),]);
        $this->setId(null);
        $this->setCity(null);
        $this->setYear(null);
        $this->setWinner(null);
    }
}
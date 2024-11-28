<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Race;
use App\Service\Router;
use App\Service\Templating;

class RaceController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $races = Race::findAll();
        $html = $templating->render('race/index.html.php', [
            'races' => $races,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $race = Race::fromArray($requestPost);
            // @todo missing validation
            $race->save();

            $path = $router->generatePath('race-index');
            $router->redirect($path);
            return null;
        } else {
            $race = new Race();
        }

        $html = $templating->render('race/create.html.php', [
            'race' => $race,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $raceId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $race = Race::find($raceId);
        if (! $race) {
            throw new NotFoundException("Missing race with id $raceId");
        }

        if ($requestPost) {
            $race->fill($requestPost);
            // @todo missing validation
            $race->save();

            $path = $router->generatePath('race-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('race/edit.html.php', [
            'race' => $race,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $raceId, Templating $templating, Router $router): ?string
    {
        $race = Race::find($raceId);
        if (! $race) {
            throw new NotFoundException("Missing race with id $raceId");
        }

        $html = $templating->render('race/show.html.php', [
            'race' => $race,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $raceId, Router $router): ?string
    {
        $race = Race::find($raceId);
        if (! $race) {
            throw new NotFoundException("Missing race with id $raceId");
        }

        $race->delete();
        $path = $router->generatePath('race-index');
        $router->redirect($path);
        return null;
    }
}

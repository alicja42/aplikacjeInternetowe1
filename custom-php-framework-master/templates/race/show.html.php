<?php

/** @var \App\Model\Race $race */
/** @var \App\Service\Router $router */

$title = "Race: {$race->getCity()} ({$race->getYear()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $race->getCity() ?> - <?= $race->getYear() ?></h1>
    <p>Winner: <?= $race->getWinner() ?></p>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('race-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('race-edit', ['id' => $race->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

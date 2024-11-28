<?php

/** @var \App\Model\Race[] $races */
/** @var \App\Service\Router $router */

$title = 'Race List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Races List</h1>

    <a href="<?= $router->generatePath('race-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($races as $race): ?>
            <li>
                <h3><?= $race->getCity() ?> - <?= $race->getYear() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('race-show', ['id' => $race->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('race-edit', ['id' => $race->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

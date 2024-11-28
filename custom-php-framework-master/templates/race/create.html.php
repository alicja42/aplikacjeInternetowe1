<?php

/** @var \App\Model\Race $race */
/** @var \App\Service\Router $router */

$title = 'Create Race';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Race</h1>
    <form action="<?= $router->generatePath('race-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="race-create">
    </form>

    <a href="<?= $router->generatePath('race-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

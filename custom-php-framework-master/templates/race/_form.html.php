<?php
/** @var $race ?\App\Model\Race */
?>

<div class="form-group">
    <label for="city">City</label>
    <input type="text" id="city" name="race[city]" value="<?= $race ? $race->getCity() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="race[year]" value="<?= $race ? $race->getYear() : '' ?>">
</div>

<div class="form-group">
    <label for="winner">Winner</label>
    <input type="text" id="winner" name="race[winner]" value="<?= $race ? $race->getWinner() : '' ?>">
</div>

<div class="form-group">
    <input type="submit" value="Submit">
</div>

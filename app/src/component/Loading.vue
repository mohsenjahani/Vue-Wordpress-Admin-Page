<template>
    <div class="loading">
        <div class="spinner is-active"></div>
    </div>
</template>

<style lang="scss">
    .loading {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.43);
        z-index: 50000;
        transition: all .5s ease-in-out;
        .spinner {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
</style>

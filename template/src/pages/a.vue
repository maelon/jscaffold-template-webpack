<template>
    <div>page-aa</div>
</template>

<script>
    import service from 'services/a';

    export default {
        mounted() {
            console.log('pagea');
            service('i am a!');
        }
    };
</script>

<style>
</style>

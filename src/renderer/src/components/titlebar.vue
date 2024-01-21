<template>
    <div id="titlebar">
        <div id="title">My Electron App</div>
        <div id="minimize-button">-</div>
        <div id="maximize-button">□</div>
        <div id="close-button">×</div>
    </div>
</template>
<style scoped>
#titlebar {
    position: fixed;
    background-color: #333;
    color: auto;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    -webkit-app-region: drag;
    /* 使标题栏可拖动 */
}

#minimize-button,
#maximize-button,
#close-button {
    cursor: pointer;
    margin-right: 8px;
}
</style>
<template>
    <div id="app" class="wrap">
        <Loading v-if="loading" />
        <h1>Vue.js Admin Panel For WP</h1>

        <div v-if="successMessage" class="notice notice-success inline">
            <p>Saved successfully.</p>
        </div>

        <h3>Texts</h3>
        <label class="text">
            <span>Title</span>
            <input v-model="settings.title" type="text" placeholder="Title" class="regular-text" />
        </label>

        <label class="text">
            <span>Description</span>
            <textarea v-model="settings.description" placeholder="Description" cols="40" rows="5"></textarea>
        </label>


        <h3>Check list</h3>
        <label v-for="n in 4">
            <input type="checkbox" :value="n" v-model="settings.checklist" />
            <span>Item {{ n }}</span>
        </label>

        <h3>Select</h3>
        <label class="select">
            <span>Color</span>
            <select v-model="settings.color">
                <option value=''>Select a color</option>
                <option v-for="color in colors" :value='color.val'>{{ color.label }}</option>
            </select>
        </label>

        <div v-if="settings.color!==''" class="colored-box" :style="{'background-color':settings.color}"></div>


        <button @click="save" class="button-primary">Save Settings</button>

        <br><br>
        <pre dir="ltr">{{ settings }}</pre>
    </div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
    import { Settings } from "./model/Settings";
    import Loading from "./component/Loading.vue";

	@Component({
        components: {Loading}
    })
	export default class App extends Vue {
	    successMessage = false;
	    loading = false;
	    settings: Settings = new Settings();

	    created(){
            // @ts-ignore
            this.settings = {...this.settings, ...vue_wp_settings_data};
        }

        save(){
	        this.loading = true;
	        // @ts-ignore
            jQuery.ajax({
                type: 'POST',
                // @ts-ignore
                url: vue_wp_api_url,
                contentType: 'application/json',
                data: JSON.stringify(this.settings),
                dataType: 'json',
                beforeSend: function ( xhr ) {
                    // @ts-ignore
                    xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                },
                success: (data) => {
                    this.loading = false;
                    this.successMessage = true;

                    setTimeout(() => {
                        this.successMessage = false;
                    }, 3000)
                },
                error:() => {
                    alert("failed");
                    this.loading = false;
                },
            });
        }

        get colors() {
	        return [
                {label:'red', val:'#f11c2d'},
                {label:'blue', val:'#2465dd'},
                {label:'green', val:'#58d02c'},
                {label:'yellow', val:'#ffbb14'},
                {label:'gray', val:'#a0a0a0'},
            ];
        }
	}
</script>

<style lang="scss" scoped>
    .wrap {
        padding-top: 20px;

        h3 {
            margin-top: 30px;
        }

        label {
            display: block;
            margin-bottom: 10px;
            &.text, &.select {
                margin-bottom: 15px;
                span {
                    display: block;
                    font-weight: 400;
                    margin-bottom: 2px;
                }
            }
        }

        .colored-box {
            width: 200px;
            height: 50px;
            margin-bottom: 15px;
            border-radius: 5px;
        }

        pre {
        }

    }

</style>

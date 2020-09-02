<?php
/**
 * Plugin Name:       Vue Admin Setting Panel
 * Plugin URI:        https://example.com/plugins/the-basics/
 * Description:       Save Plugin or Theme Settings with using Vue.js
 * Version:           1.0
 * Author:            Mohsen Jahani
 * Author URI:        https://scriptestan.ir/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       vue-admin-setting-panel
 * Domain Path:       /languages
 */

const PLUGIN_SLUG_NAME = 'vue-admin-setting-panel';
const VERSION = '1.0';
const DEV_MODE = false;

function my_vue_panel_page() {
    $setting_data_option = get_option( PLUGIN_SLUG_NAME );
    ?>
    <script type="text/javascript">
        const vue_wp_api_url = "<?php echo get_site_url().'/wp-json/'.PLUGIN_SLUG_NAME.'/save' ?>";
        const vue_wp_settings_data = <?php
                if($setting_data_option){
                    echo json_encode($setting_data_option);
                }else {
                    echo '{}';
                }
            ?>;
    </script>
    <div id="app-vue-admin-setting-panel"></div>
    <?php

    wp_enqueue_script( PLUGIN_SLUG_NAME, plugin_dir_url( __FILE__ ). 'app/dist/build.js', array(),
        DEV_MODE?time():VERSION, true );
    wp_enqueue_style( PLUGIN_SLUG_NAME, plugin_dir_url( __FILE__ ). 'app/dist/main.css', array(),
        DEV_MODE?time():VERSION);
}

function add_menu_item() {
    add_menu_page("Vue.js Admin Panel", "Vue Admin Panel", "manage_options",
        PLUGIN_SLUG_NAME, "my_vue_panel_page", 'dashicons-screenoptions', 99999);
}
add_action("admin_menu", "add_menu_item");



/**
 * Rest api for saving setting
 * @param $request
 * @return mixed
 */
function save_settings_func( $request ) {
    $user = wp_get_current_user();
    if (is_super_admin( $user->ID )) {
        return update_option( PLUGIN_SLUG_NAME, $request->get_json_params() );
    } else {
        return new WP_Error('not_allowed', null, array('status' => 403,));
    }
}
add_action( 'rest_api_init', function () {
    register_rest_route( PLUGIN_SLUG_NAME, '/save', array(
        'methods' => 'POST',
        'callback' => 'save_settings_func',
    ) );
} );

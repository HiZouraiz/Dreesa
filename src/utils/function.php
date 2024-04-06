<?php
/**
 * Functions and definitions
 *
 * @package Jadro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( 'Direct script access denied.' );
}

define( 'JADRO_VERSION', '1.0.1' );
define( 'JADRO_DIR', rtrim( get_template_directory(), '/' ) );
/**
 * Theme setup.
 *
 * @since 1.0.0
 */
function jadro_setup() {
	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Let WordPress manage the document title.
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails.
	add_theme_support( 'post-thumbnails' );

	// Admin editor styles.
	add_theme_support( 'editor-styles' );

	// Switch default core markup for different forms to output valid HTML5.
	add_theme_support( 'html5', array( 'comment-form', 'comment-list' ) );

	// Add support for responsive embeds.
	add_theme_support( 'responsive-embeds' );

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	// Enable block styles.
	add_theme_support( 'wp-block-styles' );

	// Enqueue editor styles.
	add_editor_style();
}

add_action( 'after_setup_theme', 'jadro_setup' );

/**
 * Enqueue scripts and styles.
 *
 * @since 1.0.0
 */
function jadro_scripts() {
	wp_enqueue_style( 'jadro-style', get_stylesheet_uri(), array(), JADRO_VERSION );
	wp_style_add_data( 'jadro-style', 'rtl', 'replace' );
}

add_action( 'wp_enqueue_scripts', 'jadro_scripts' );

/**
 * Register block patterns category.
 *
 * @since 1.0.0
 */
function jadro_register_block_patterns_category() {
	register_block_pattern_category(
		'jadro',
		array(
			'label' => esc_html__( 'Jadro', 'jadro' ),
		)
	);
}

add_action( 'init', 'jadro_register_block_patterns_category', 9 );

/**
 * Register block styles.
 *
 * @since 1.0.0
 */
function jadro_register_block_styles() {
	$block_styles = array(
		'core/list'      => array(
			'checklist'        => esc_html__( 'Checklist', 'jadro' ),
			'checklist-circle' => esc_html__( 'Checklist Circle', 'jadro' ),
			'square'           => esc_html__( 'Square', 'jadro' ),
			'none'             => esc_html__( 'None', 'jadro' ),
		),
		'core/separator' => array(
			'dotted'         => esc_html__( 'Dotted', 'jadro' ),
			'wide-thin-line' => esc_html__( 'Wide Thin Line', 'jadro' ),
			'left-aligned'   => esc_html__( 'Left Aligned', 'jadro' ),
			'right-aligned'  => esc_html__( 'Right Aligned', 'jadro' ),
		),
	);

	foreach ( $block_styles as $block => $styles ) {
		foreach ( $styles as $style_name => $style_label ) {
			register_block_style(
				$block,
				array(
					'name'  => $style_name,
					'label' => $style_label,
				)
			);
		}
	}
}

add_action( 'init', 'jadro_register_block_styles' );

// WooCommerce customizations.
if ( class_exists( 'WooCommerce', false ) ) {
	require_once JADRO_DIR . '/inc/woocommerce.php';
}

/**
 * Custom REST API endpoint for forgot password functionality.
 */
function custom_forgot_password_endpoint( $request ) {
    $parameters = $request->get_json_params();

    if ( empty( $parameters['email'] ) ) {
        return new WP_Error( 'invalid_email', __( 'Email is required.', 'text-domain' ), array( 'status' => 400 ) );
    }

    // Attempt to retrieve user information based on email.
    $user_data = get_user_by( 'email', $parameters['email'] );

    if ( ! $user_data ) {
        return new WP_Error( 'invalid_user', __( 'No user found with this email.', 'text-domain' ), array( 'status' => 404 ) );
    }

    // Get username
    $username = $user_data->user_login;

    // Generate and send password reset email.
    $reset_password_key = get_password_reset_key( $user_data );
    $reset_password_url = 'https://tagelda.com/wp-login.php?action=rp&key=' . $reset_password_key . '&login=' . $username;

    $subject = 'Password Reset';
    $message = 'Please click on the following link to reset your password: ' . $reset_password_url;

    $sent = wp_mail( $parameters['email'], $subject, $message );

    if ( ! $sent ) {
        return new WP_Error( 'email_send_error', __( 'Failed to send reset password email.', 'text-domain' ), array( 'status' => 500 ) );
    }

    return new WP_REST_Response( array( 'message' => __( 'Password reset email sent successfully.', 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/forgot-password', array(
        'methods'  => 'POST',
        'callback' => 'custom_forgot_password_endpoint',
    ) );
} );


/**
 * Custom REST API endpoint for storing notification tokens against user profiles.
 */
function custom_store_notification_token_endpoint( $request ) {
    $parameters = $request->get_json_params();

    if ( empty( $parameters['user_id'] ) || empty( $parameters['notification_token'] ) ) {
        return new WP_Error( 'invalid_data', __( 'User ID and Notification Token are required.', 'text-domain' ), array( 'status' => 400 ) );
    }

    $user = get_userdata( $parameters['user_id'] );

    if ( ! $user ) {
        return new WP_Error( 'invalid_user', __( 'No user found with this ID.', 'text-domain' ), array( 'status' => 404 ) );
    }

    // Update user meta with notification token
    update_user_meta( $parameters['user_id'], 'notification_token', $parameters['notification_token'] );

    return new WP_REST_Response( array( 'message' => __( 'Notification token stored successfully.', 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/store-notification-token', array(
        'methods'  => 'POST',
        'callback' => 'custom_store_notification_token_endpoint',
    ) );
} );


/**
 * Custom REST API endpoint for retrieving saved notification token by user ID.
 */
function custom_get_notification_token_endpoint( $request ) {
    $parameters = $request->get_params();

    if ( empty( $parameters['user_id'] ) ) {
        return new WP_Error( 'invalid_data', __( 'User ID is required.', 'text-domain' ), array( 'status' => 400 ) );
    }

    $user_id = intval( $parameters['user_id'] );
    $notification_token = get_user_meta( $user_id, 'notification_token', true );

    if ( ! $notification_token ) {
        return new WP_Error( 'no_token_found', __( 'No notification token found for this user.', 'text-domain' ), array( 'status' => 404 ) );
    }

    return new WP_REST_Response( array( 'notification_token' => $notification_token ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/get-notification-token/(?P<user_id>\d+)', array(
        'methods'  => 'GET',
        'callback' => 'custom_get_notification_token_endpoint',
    ) );
} );


/**
 * Action hook to send push notification when order status changes.
 */
function send_push_notification_on_order_status_change( $order_id, $old_status, $new_status, $order ) {
    // Define notification title
    $notification_title = 'Booking';

    // Define notification message based on the order status
    switch ( $new_status ) {
        case 'completed':
            $notification_message = 'Your order is now completed.';
            break;
        case 'cancelled':
            $notification_message = 'Your order has been cancelled.';
            break;
        case 'shipped':
            $notification_message = 'Your order has been shipped.';
            break;
        // Add more cases as needed for other order statuses
        default:
            $notification_message = 'Your order status has been updated to: ' . $new_status;
            break;
    }

    // Get user ID associated with the order
    $user_id = $order->get_customer_id();

    // Fetch notification token for the user
    $notification_token = get_user_meta( $user_id, 'notification_token', true );

    // Check if notification token exists
    if ( $notification_token ) {
        // Send push notification using Expo's push notification service
        $response = send_push_notification( $notification_token, $notification_title, $notification_message );
        
        // Log the response
        error_log( 'Push notification response: ' . print_r( $response, true ) );
    }
}
add_action( 'woocommerce_order_status_changed', 'send_push_notification_on_order_status_change', 10, 4 );

/**
 * Function to send push notification using Expo's push notification service.
 */
function send_push_notification( $notification_token, $title, $msg ) {
    // Define the notification data
    $notification_data = array(
        'to' => $notification_token,
        'title' => $title,
        'body' => $msg,
        'data' => array( 'msg' => $msg, 'title' => $title ),
        'priority' => 'high',
        'sound' => 'default',
        'channelId' => 'messages'
    );

    // Send the push notification
    $response = wp_remote_post( 'https://exp.host/--/api/v2/push/send', array(
        'method' => 'POST',
        'headers' => array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'accept-encoding' => 'gzip, deflate',
            'host' => 'exp.host'
        ),
        'body' => json_encode( $notification_data ),
    ) );

    // Return the response
    return $response;
}

// Step 1: Create a Custom Admin Page
function custom_notification_page() {
    add_menu_page(
        'Send Notifications', // Page title
        'Send Notifications', // Menu title
        'manage_options', // Capability required to access
        'send-notifications', // Menu slug
        'render_notification_page', // Function to render page content
        'dashicons-email', // Icon
        80 // Menu position
    );
}
add_action( 'admin_menu', 'custom_notification_page' );

// Step 2: Render the Custom Admin Page
function render_notification_page() {
    if ( isset( $_POST['send_notifications'] ) ) {
         // Handle form submission
         $title = sanitize_text_field( $_POST['notification_title'] );
         $description = sanitize_textarea_field( $_POST['notification_description'] );
 
         global $wpdb;
         $table_name = $wpdb->prefix . 'public_notification_tokens';
 
         // Get all notification tokens from the public notification table
         $notification_tokens = $wpdb->get_col( "SELECT notification_token FROM $table_name" );
 
         // Send notifications to users with tokens
         foreach ( $notification_tokens as $notification_token ) {
             send_push_notification( $notification_token, $title, $description );
         }
 
         echo '<div class="updated"><p>Notifications sent successfully!</p></div>';
    
    }
    ?>
    <div class="wrap">
        <h2>Send Notifications</h2>
        <form method="post">
            <label for="notification_title">Notification Title:</label><br>
            <input type="text" id="notification_title" name="notification_title" style="width: 100%;"><br><br>

            <label for="notification_description">Notification Description:</label><br>
            <textarea id="notification_description" name="notification_description" style="width: 100%; height: 150px;"></textarea><br><br>

            <input type="submit" name="send_notifications" class="button button-primary" value="Send Notifications">
        </form>
    </div>
    <?php
}


function create_public_notification_tokens_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'public_notification_tokens';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        notification_token varchar(255) NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );
}

// Register table creation function to be called upon plugin activation
register_activation_hook( __FILE__, 'create_public_notification_tokens_table' );

// Step 2: Custom REST API endpoint to create the table
function create_public_notification_tokens_table_endpoint( $request ) {
    // Trigger the table creation function
    create_public_notification_tokens_table();

    // Return success message
    return new WP_REST_Response( array( 'message' => __( 'Public notification tokens table created successfully.', 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/create-public-notification-table', array(
        'methods'  => 'POST',
        'callback' => 'create_public_notification_tokens_table_endpoint',
    ) );
} );

// Step 1: Store Public Notification Tokens
function store_public_notification_token_endpoint( $request ) {
    $parameters = $request->get_json_params();

    if ( empty( $parameters['notification_token'] ) ) {
        return new WP_Error( 'invalid_data', __( 'Notification Token is required.', 'text-domain' ), array( 'status' => 400 ) );
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'public_notification_tokens';
    $notification_token = $parameters['notification_token'];

    // Check if the token already exists
    $existing_token = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE notification_token = %s", $notification_token ) );

    if ( $existing_token ) {
        // If token already exists, return a response indicating that it's a duplicate
        return new WP_REST_Response( array( 'message' => __( 'Notification token already exists.', 'text-domain' ) ), 400 );
    } else {
        // If token doesn't exist, insert a new entry
        $wpdb->insert(
            $table_name,
            array( 'notification_token' => $notification_token ),
            array( '%s' )
        );
        $message = 'Public notification token stored successfully.';
    }

    return new WP_REST_Response( array( 'message' => __( $message, 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/store-public-notification-token', array(
        'methods'  => 'POST',
        'callback' => 'store_public_notification_token_endpoint',
    ) );
} );

// Step 2: Retrieve Public Notification Tokens
function get_public_notification_tokens_endpoint( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'public_notification_tokens';

    $tokens = $wpdb->get_col( "SELECT notification_token FROM $table_name" );

    if ( empty( $tokens ) ) {
        return new WP_Error( 'no_tokens_found', __( 'No public notification tokens found.', 'text-domain' ), array( 'status' => 404 ) );
    }

    return new WP_REST_Response( array( 'tokens' => $tokens ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/get-public-notification-tokens', array(
        'methods'  => 'GET',
        'callback' => 'get_public_notification_tokens_endpoint',
    ) );
} );


// Step 3: Empty Public Notification Tokens Table
function empty_public_notification_tokens_endpoint( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'public_notification_tokens';

    // Empty the table
    $wpdb->query( "TRUNCATE TABLE $table_name" );

    return new WP_REST_Response( array( 'message' => __( 'Public notification tokens table emptied successfully.', 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/empty-public-notification-tokens', array(
        'methods'  => 'POST',
        'callback' => 'empty_public_notification_tokens_endpoint',
    ) );
} );

/**
 * Custom REST API endpoint for deleting notification token by user ID.
 */
function custom_delete_notification_token_endpoint( $request ) {
    $parameters = $request->get_params();

    if ( empty( $parameters['user_id'] ) ) {
        return new WP_Error( 'invalid_data', __( 'User ID is required.', 'text-domain' ), array( 'status' => 400 ) );
    }

    $user_id = intval( $parameters['user_id'] );

    // Delete notification token meta for the user
    delete_user_meta( $user_id, 'notification_token' );

    return new WP_REST_Response( array( 'message' => __( 'Notification token deleted successfully.', 'text-domain' ) ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/delete-notification-token/(?P<user_id>\d+)', array(
        'methods'  => 'DELETE',
        'callback' => 'custom_delete_notification_token_endpoint',
    ) );
} );





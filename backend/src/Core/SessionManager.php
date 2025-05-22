<?php
namespace backend\Core;

class SessionManager
{
    public static function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'domain' => '.meetlink.local',
                'secure' => true,
                'httponly' => true,
                'samesite' => 'none'

            ]);

            session_start();
        }
    }
}

<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"), 'email', 'role', 'created_at')
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function roles()
    {
        return Inertia::render('Users/Roles');
    }

    public function permissions()
    {
        return Inertia::render('Users/Permissions');
    }
}

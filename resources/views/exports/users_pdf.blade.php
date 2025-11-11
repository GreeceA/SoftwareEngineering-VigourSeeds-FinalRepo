<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Employee Information - Vigour Seeds</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #37692F;
        }
        
        .company-name {
            color: #37692F;
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
        }
        
        .report-title {
            color: #333;
            font-size: 18px;
            font-weight: 600;
            margin: 5px 0 0 0;
        }
        
        .report-info {
            display: flex;
            justify-content: space-between;
            margin: 25px 0;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            border-left: 4px solid #37692F;
        }
        
        .info-item {
            flex: 1;
            text-align: center;
        }
        
        .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #37692F;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        thead {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
        }
        
        th {
            color: #37692F; 
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }
        
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #e9ecef;
            font-size: 10px;
            vertical-align: middle; /* Added for better alignment */
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        tr:hover {
            background-color: #e9ecef;
        }
        
        .user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #e9ecef;
        }
        
        .avatar-placeholder {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            border: 2px solid #e9ecef;
        }
        
        .role-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            min-width: 60px;
        }
        
        .role-manager {
            background-color: #8b5cf6;
            color: white;
        }
        
        .role-employee {
            background-color: #3b82f6;
            color: white;
        }
        
        .role-admin {
            background-color: #dc2626;
            color: white;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            min-width: 55px;
        }
        
        .status-active {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .status-inactive {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        
        .user-name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .user-email {
            color: #6b7280;
            font-size: 9px;
        }
        
        .you-badge {
            background-color: #dbeafe;
            color: #1e40af;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 8px;
            font-weight: 500;
            margin-left: 5px;
        }
        
        .summary {
            margin-top: 30px;
            padding: 15px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .summary-title {
            font-size: 12px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 8px;
        }
        
        .summary-stats {
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        
        .stat-item {
            flex: 1;
        }
        
        .stat-number {
            font-size: 18px;
            font-weight: 700;
            color: #065f46;
        }
        
        .stat-label {
            font-size: 9px;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .mb-10 {
            margin-bottom: 10px;
        }
        
        .mt-20 {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Employee Information Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Employees</div>
            <div class="info-value">{{ count($users) }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Employees</div>
            <div class="info-value">{{ $users->where('status', 'active')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Employee Directory</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 10%; text-align: center;">Emp. ID</th>
                <th style="width: 35%">Employee Details</th>
                <th style="width: 20%">Role</th>
                <th style="width: 15%">Status</th>
                <th style="width: 20%">Joined Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $index => $user)
            <tr>
                <td class="text-center">#{{ $user->id }}</td>
                
                <td>
                    <div class="user-name">
                        {{ $user->first_name }} {{ $user->last_name }}
                        @if($user->id === auth()->id())
                            <span class="you-badge">YOU</span>
                        @endif
                    </div>
                    <div class="user-email">{{ $user->email }}</div>
                </td>
                
                <td>
                    @foreach($user->roles as $role)
                        <span class="role-badge role-{{ strtolower($role->name) }}">
                            {{ $role->name }}
                        </span>
                        @if(!$loop->last)<br>@endif
                    @endforeach
                </td>
                
                <td>
                    <span class="status-badge status-{{ $user->status }}">
                        {{ ucfirst($user->status) }}
                    </span>
                </td>

                <td>{{ $user->created_at->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Employee Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $users->count() }}</div>
                <div class="stat-label">Total Employees</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $users->where('status', 'active')->count() }}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $users->where('status', 'inactive')->count() }}</div>
                <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $users->filter(function($user) { return $user->roles->contains('name', 'Manager'); })->count() }}</div>
                <div class="stat-label">Managers</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $users->filter(function($user) { return $user->roles->contains('name', 'Employee'); })->count() }}</div>
                <div class="stat-label">Employees</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="mb-10">
            <strong>Vigour Seeds - Employee Information System</strong><br>
            This report contains confidential employee information. For authorized use only.
        </div>
        <div>
            Generated by: {{ auth()->user()->first_name }} {{ auth()->user()->last_name }} • 
            Page 1 of 1 • 
            Document ID: VS-EMP-{{ now()->format('Ymd-His') }}
        </div>
    </div>
</body>
</html>
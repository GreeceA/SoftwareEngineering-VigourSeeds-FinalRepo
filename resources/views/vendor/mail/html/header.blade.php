@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset('images/vigour-logo.png') }}" class="logo" alt="Vigour Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>

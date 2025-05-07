<?php

namespace App\Listeners;

use App\Events\newUserEvent;
use App\Mail\newUsermail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class newUserListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(newUserEvent $event): void
    {
        //send email to new user ;
        Mail::to($event->user->email)->send(new newUsermail($event->user)) ;
        Log::info('send email to ' . $event->user->email . ' .') ;
    }
}

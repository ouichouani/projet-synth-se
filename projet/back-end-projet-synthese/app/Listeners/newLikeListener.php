<?php

namespace App\Listeners;

use App\Events\newLikeEvent;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class newLikeListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(newLikeEvent $event): void
    {
        if (!empty($event->like)) {
            Notification::create([
                'type'      => 'like',
                'content'   => $event->like->user->name . ' add like on your pin with title : ' . $event->like->pin->title,
                'read_at'   => null,
                'user_id'   => $event->like->pin->user_id,
                'actor_id'  => $event->like->user_id,
                'pin_id'    => $event->like->pin->id,
            ]);
        }
    }
}

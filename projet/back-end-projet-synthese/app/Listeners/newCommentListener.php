<?php

namespace App\Listeners;

use App\Events\newCommentEvent;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class newCommentListener
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
    public function handle(newCommentEvent $event): void
    {
        if (!empty($event->comment)) {
            Notification::create([
                'type'      => 'comment',
                'content'   => $event->comment->user->name . ' add comment on your pin with title : ' . $event->comment->pin->title,
                'read_at'   => null,
                'user_id'   => $event->comment->pin->user_id,
                'actor_id'  => $event->comment->user_id,
                'pin_id'    => $event->comment->pin->id,
            ]);
        }
    }
}

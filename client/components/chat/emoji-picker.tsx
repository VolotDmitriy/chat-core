'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { RefObject, useEffect, useRef } from 'react';

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    emojiButtonRef: RefObject<HTMLButtonElement | null>;
    onClose: () => void;
}

export function EmojiPicker({
    onEmojiSelect,
    emojiButtonRef,
    onClose,
}: EmojiPickerProps) {
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                emojiButtonRef &&
                !emojiButtonRef.current?.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [emojiButtonRef, onClose]);

    return (
        <div ref={pickerRef} className="absolute right-0 bottom-full z-50 mb-2">
            <Picker
                data={data}
                onEmojiSelect={(emoji: { native: string }) =>
                    onEmojiSelect(emoji.native)
                }
                theme="dark"
                previewPosition="none"
                skinTonePosition="search"
                set="native"
            />
        </div>
    );
}

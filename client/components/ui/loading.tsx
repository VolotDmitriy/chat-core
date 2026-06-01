import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';

export function SpinnerEmpty() {
    return (
        <Item variant="muted">
            <ItemMedia>
                <Spinner className="size-6" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="line-clamp-1">Please wait</ItemTitle>
            </ItemContent>
        </Item>
    );
}

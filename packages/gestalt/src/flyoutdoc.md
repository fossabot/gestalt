<Flyout
contents={
<Box padding={3} display="flex" alignItems="center" direction="column" column={12}>
<Text align="center" weight="bold">
Need help with something? Check out our Help Center.
</Text>
<Box paddingX={2} marginTop={3}>
<Button color="red" text="Visit the help center" />
</Box>
</Box>}
anchor={(visibility, setVisibility) =>
<Box display="inlineBlock" ref={anchorRef}>
<Button
accessibilityExpanded={visibility === 'open'}
accessibilityHaspopup
onClick={() => setVisibility(visibility === 'open' ? 'closed' : 'open')}
text="Help"
/>
</Box>
}
idealDirection="up"
onVisibilityChange={({ visibility (open / closed) }) => {}}
size="md"

>

</Flyout>

Inside of modal (children) // flex="grow" / overflow="auto"

<ScrollContainer
onScroll={updateShadows}

>

    {children}

</ScrollContainer>

- Maintain state in Flyout so it doesn't server render
- Always render Layer in Flyout
- Layer uses React context

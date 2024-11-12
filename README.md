# Redux Posts App

A React application for creating, editing, and interacting with posts using modern state management and optimistic updates.

## Features

- Create new posts
- Edit existing posts
- Add reactions to posts with optimistic updates
- Cached API responses for improved performance
- Normalized data structure using Redux Entity Adapter

## Tech Stack

- **React** - Frontend framework
- **Redux Toolkit** - State management
- **RTK Query** - API calls and data fetching
- **Redux Entity Adapter** - Data normalization

## Architecture

### State Management
The application uses Redux Toolkit for efficient state management with the following key features:

- **Normalized State**: Posts data is normalized using Redux Entity Adapter, providing a flat and efficient data structure
- **Cached Responses**: RTK Query handles API caching to minimize unnecessary network requests
- **Optimistic Updates**: Reactions are updated immediately in the UI and rolled back if the API call fails

### Data Flow

1. **Posts Fetching**:
   - RTK Query handles API calls with automatic caching
   - Responses are normalized using Entity Adapter
   - Cached data is automatically invalidated when needed

2. **Post Operations**:
   - Create: New posts are added to the normalized store
   - Edit: Updates are managed through Entity Adapter's helpers
   - React: Optimistic updates using `onQueryStarted` callback

### Optimistic Updates Implementation

```javascript
// Example of optimistic update for reactions
 addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions }
      }),
      async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId]
            if (post) post.reactions = reactions
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    })
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-posts-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── store.js         # Redux store configuration
│   └── api.js           # RTK Query API definitions
├── features/
│   └── posts/
│       ├── postsSlice.js    # Posts reducer and actions
│       ├── PostsList.js     # Posts list component
│       ├── AddPostForm.js   # Create post form
│       └── EditPostForm.js  # Edit post form
└── components/
    └── common/          # Shared components
```

## Usage

### Creating a Post
```javascript
const dispatch = useDispatch()
const [addNewPost] = useAddNewPostMutation()

const handleSubmit = async (postData) => {
  try {
    await addNewPost(postData).unwrap()
  } catch (err) {
    console.error('Failed to save the post', err)
  }
}
```

### Adding a Reaction
```javascript
const reactionEmoji = {
	thumbsUp: "👍",
	wow: "😮",
	heart: "❤️",
	rocket: "🚀",
	coffee: "☕",
};

export default function ReactionButtons({ post }) {
	const [addReaction] = useAddReactionMutation();

	const reactionButtons = Object.entries(reactionEmoji).map(
		([name, emoji]) => {
			return (
				<button
					key={name}
					type="button"
					className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out m-1 border border-blue-300"
					onClick={() => {
						const newValue = post.reactions[name] + 1;
						addReaction({
							postId: post.id,
							reactions: { ...post.reactions, [name]: newValue },
						});
					}}
				>
					{emoji} {post.reactions[name]}
				</button>
			);
		}
	);
	return <div>{reactionButtons}</div>;
}
```

## Best Practices

1. **Data Normalization**:
   - Use Entity Adapter for consistent data structure
   - Maintain relationships between entities
   - Avoid data duplication

2. **Optimistic Updates**:
   - Implement proper error handling
   - Revert changes on API failure
   - Maintain consistent UI state

3. **Performance**:
   - Leverage RTK Query caching
   - Use memoization for expensive computations
   - Implement proper loading states

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
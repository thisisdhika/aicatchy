export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Admin — Coming in post-MLP
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center">
            The admin interface for managing formulas, affiliate links, and user profiles
            is currently under development. This section will be available in a subsequent phase.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h2 className="text-lg font-medium text-blue-900">In the meantime:</h2>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Manage formulas using Drizzle Studio</li>
              <li>• View analytics through PostHog dashboard</li>
              <li>• Monitor generation logs</li>
              <li>• Check affiliate link performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

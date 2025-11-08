// Imports
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import ContentContainer from "../../components/ContentContainer";

// Legal information page (license, copyright, source code access)
export default function LegalPage() {
  return (
    <PageLayout>
      <ContentContainer className="py-16">
        <h1 className="text-4xl font-bold mb-8">Legal Information</h1>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Copyright Notice</h2>
            <p className="text-gray-400">
              Risith Blog (Source Code)
              <br />
              Copyright &copy; 2025 Risith
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Open Source License</h2>
            <p className="text-gray-400 mb-2">
              This website is free software: you can redistribute it and/or modify
              it under the terms of the GNU Affero General Public License as
              published by the Free Software Foundation, either version 3 of the
              License, or (at your option) any later version.
            </p>
            <p className="text-gray-400">
              This program is distributed in the hope that it will be useful, but
              WITHOUT ANY WARRANTY; without even the implied warranty of
              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
              Affero General Public License for more details.
            </p>
            <div className="mt-4">
              <a
                href="https://www.gnu.org/licenses/agpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-300"
              >
                Read Full License
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Source Code Access</h2>
            <p className="text-gray-400 mb-2">
              As required by the GNU Affero General Public License version 3, the
              complete source code for this website is available for download.
            </p>
            <p className="text-gray-400 mb-2">
              You can access the source code, contribute, or learn more about this
              project at:
            </p>
            <div className="rounded-lg bg-gray-800 p-4 mb-4">
              <code className="text-sm break-all">
                https://github.com/risithcha/risith-blog
              </code>
            </div>
            <a
              href="https://github.com/risithcha/risith-blog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-white font-semibold"
            >
              View Source Code on GitHub
            </a>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2 mt-8">Questions?</h2>
            <p className="text-gray-400">
              If you have questions about licensing or need additional information,
              please contact me at {" "}
              <a
                href="mailto:risithcha@gmail.com"
                className="underline text-blue-400 hover:text-blue-300"
              >
                risithcha@gmail.com
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/" className="inline-block px-4 py-2 border border-gray-700 rounded hover:bg-gray-800">
            Back to Home
          </Link>
        </div>
      </ContentContainer>
    </PageLayout>
  );
}
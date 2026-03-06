$srcPath = "c:\Shane\Codec\client\src"

Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx","*.js" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'NeonCard|neon-|btn-neon|btn-danger|shadow-neon|border-dim|font-accent|animate-pulse-neon|animate-glow|animate-float') {
        # Step 1: NeonCard -> BrutalCard
        $content = $content -replace "from '\.\./ui/NeonCard'", "from '../ui/BrutalCard'"
        $content = $content -replace "from '\.\./\.\./components/ui/NeonCard'", "from '../../components/ui/BrutalCard'"
        $content = $content -replace "from '\./NeonCard'", "from './BrutalCard'"
        $content = $content -replace '<NeonCard', '<BrutalCard'
        $content = $content -replace '</NeonCard>', '</BrutalCard>'
        $content = $content -replace 'NeonCard', 'BrutalCard'

        # Step 2: btn classes (longer first)
        $content = $content -replace 'btn-neon-purple', 'btn-brutal-purple'
        $content = $content -replace 'btn-neon-gold', 'btn-brutal-yellow'
        $content = $content -replace 'btn-neon', 'btn-brutal'
        $content = $content -replace 'btn-danger', 'btn-brutal-danger'

        # Step 3: shadow classes (longer first)
        $content = $content -replace 'shadow-neon-purple', 'shadow-brutal-md'
        $content = $content -replace 'shadow-neon-gold', 'shadow-brutal-md'
        $content = $content -replace 'shadow-neon-pink', 'shadow-brutal-md'
        $content = $content -replace 'shadow-neon', 'shadow-brutal-md'

        # Step 4: neon color tokens (longer first)
        $content = $content -replace 'neon-magenta', 'brutal-pink'
        $content = $content -replace 'neon-purple', 'brutal-purple'
        $content = $content -replace 'neon-orange', 'brutal-orange'
        $content = $content -replace 'neon-cyan', 'brutal-mint'
        $content = $content -replace 'neon-gold', 'brutal-yellow'
        $content = $content -replace 'neon-blue', 'brutal-blue'
        $content = $content -replace 'neon-pink', 'brutal-coral'

        # Step 5: border-dim, font-accent
        $content = $content -replace 'border-dim', 'brutal-black'
        $content = $content -replace 'font-accent', 'font-heading'

        # Step 6: neon-card CSS class
        $content = $content -replace 'neon-card', 'brutal-card'

        # Step 7: remove animation classes
        $content = $content -replace ' animate-pulse-neon', ''
        $content = $content -replace ' animate-glow', ''
        $content = $content -replace ' animate-float', ''

        Set-Content $_.FullName $content -NoNewline
        Write-Host "Modified: $($_.FullName)"
    }
}
